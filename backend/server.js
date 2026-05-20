const express = require("express");
const cors = require("cors");
const db = require("./db");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/employees", (req, res) => {

  const query = `
    SELECT 
      e.employee_name,
      d.department_name,
      s.spending_date,
      s.value
    FROM employees e
    JOIN departments d
      ON e.department_id = d.department_id
    LEFT JOIN spendings s
      ON e.employee_id = s.employee_id
    ORDER BY s.value ASC
  `;

  db.query(query, (err, result) => {

    if(err){
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

app.post("/employees", (req, res) => {

  const { employee_name, department_id } = req.body;

  const query = `
    INSERT INTO employees
    (employee_name, department_id)
    VALUES (?, ?)
  `;

  db.query(
    query,
    [employee_name, department_id],
    (err, result) => {

      if(err){
        return res.status(500).json(err);
      }

      res.json({
        message: "Employee added successfully"
      });

    }
  );

});

app.put("/employees/:id", (req, res) => {

  const id = req.params.id;

  const {
    employee_name,
    department_id
  } = req.body;

  const query = `
    UPDATE employees
    SET employee_name = ?,
        department_id = ?
    WHERE employee_id = ?
  `;

  db.query(
    query,
    [employee_name, department_id, id],
    (err, result) => {

      if(err){
        return res.status(500).json(err);
      }

      res.json({
        message: "Employee updated successfully"
      });

    }
  );

});

app.delete("/employees/:id", (req, res) => {

  const id = req.params.id;

  const query = `
    DELETE FROM employees
    WHERE employee_id = ?
  `;

  db.query(query, [id], (err, result) => {

    if(err){
      return res.status(500).json(err);
    }

    res.json({
      message: "Employee deleted successfully"
    });

  });

});

app.get("/export/excel", (req, res) => {

  const query = `
    SELECT 
      e.employee_name,
      d.department_name,
      s.spending_date,
      s.value
    FROM employees e
    JOIN departments d
      ON e.department_id = d.department_id
    JOIN spendings s
      ON e.employee_id = s.employee_id
    ORDER BY s.value ASC
  `;

  db.query(query, (err, result) => {

    if(err){
      return res.status(500).json(err);
    }

    const worksheet = XLSX.utils.json_to_sheet(result);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Spendings"
    );

    const excelBuffer = XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "buffer"
      }
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=spending-report.xlsx"
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(excelBuffer);

  });

});

app.get("/export/pdf", (req, res) => {

  const query = `
    SELECT 
      e.employee_name,
      d.department_name,
      s.spending_date,
      s.value
    FROM employees e
    JOIN departments d
      ON e.department_id = d.department_id
    JOIN spendings s
      ON e.employee_id = s.employee_id
    ORDER BY s.value ASC
  `;

  db.query(query, (err, result) => {

    if(err){
      return res.status(500).json(err);
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=spending-report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(18)
       .text("Spending Report", {
         align: "center"
       });

    doc.moveDown();

    result.forEach((item, index) => {

      doc
        .fontSize(12)
        .text(
          `${index + 1}. ${item.employee_name} | ${item.department_name} | ${item.spending_date} | Rp ${item.value}`
        );

    });

    doc.end();

  });

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
