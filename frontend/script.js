let currentRole = "";

function login() {

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if(username === "" || password === "") {
    alert("Please fill username and password");
    return;
  }

  currentRole = role;

  document.querySelector(".login-box").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  loadData();
}

function updateData() {

  if(currentRole !== "admin") {
    alert("Akses ditolak: Hanya Admin yang dapat melakukan aksi ini.");
    return;
  }

  alert("Update success");
}

function deleteData() {

  if(currentRole !== "admin") {
    alert("Akses ditolak: Hanya Admin yang dapat melakukan aksi ini.");
    return;
  }

  alert("Delete success");
}

function searchData() {

  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#tableBody tr");

  rows.forEach(row => {

    const employee = row.cells[0].innerText.toLowerCase();
    const department = row.cells[1].innerText.toLowerCase();

    if(employee.includes(input) || department.includes(input)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }

  });

}

function loadData(){

  fetch("http://localhost:3000/employees")
  .then(res => res.json())
  .then(data => {

    const table = document.getElementById("tableBody");

    table.innerHTML = "";

    data.forEach(item => {

      table.innerHTML += `
        <tr>
          <td>${item.employee_name}</td>
          <td>${item.department_name}</td>
          <td>${item.spending_date || "-"}</td>
          <td>${item.value || "-"}</td>
        </tr>
      `;

    });

  });

}

function exportExcel(){
  window.open("http://localhost:3000/export/excel", "_blank");
}

function exportPDF(){
  window.open("http://localhost:3000/export/pdf", "_blank");
}
