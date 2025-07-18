const API_DB = 'http://localhost:3000/api/database';
let selectedServer = '';

async function fetchServers() {
  const res = await fetch(`${API_DB}/servers`);
  const servers = await res.json();
  const select = document.getElementById('serverSelect');
  select.innerHTML = '<option value="">Select a server</option>';
  servers.forEach(server => {
    const option = document.createElement('option');
    option.value = server.name;
    option.textContent = `${server.name} (${server.ip})`;
    if (server.name === 'pyawbwe_sever') {
      option.value = 'pyawbwe_server';
    }
    select.appendChild(option);
  });
}

async function connectToServer() {
  selectedServer = document.getElementById('serverSelect').value;
  if (selectedServer) {
    fetchUsers();
  } else {
    document.getElementById('userTable').innerHTML = '';
  }
}

async function fetchUsers() {
  if (!selectedServer) return;
  try {
    const res = await fetch(`http://localhost:3000/api/${selectedServer}/users`);
    if (!res.ok) {
      document.getElementById('userTable').innerHTML = '<tr><td colspan="3">Could not fetch users. Is the database connected?</td></tr>';
      return;
    }
    const users = await res.json();

    const table = document.getElementById('userTable');
    table.innerHTML = '';
    users.forEach(user => {
      table.innerHTML += `
        <tr>
          <td>${user.User_Name}</td>
          <td>${user.User_Type}</td>
          <td>
            <button onclick="editUser(${user.id}, '${user.User_Name}', '${user.Password}', '${user.User_Type}', '${user.Status}')" class="btn btn-sm btn-warning">Edit</button>
            <button onclick="deleteUser(${user.id})" class="btn btn-sm btn-danger">Delete</button>
          </td>
        </tr>`;
    });
  } catch (error) {
    document.getElementById('userTable').innerHTML = '<tr><td colspan="3">Could not fetch users. Is the database connected?</td></tr>';
  }
}

async function addOrUpdateUser(e) {
  e.preventDefault();
  if (!selectedServer) {
    alert('Please select a server first.');
    return;
  }
  const id = document.getElementById('userId').value;
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;
  const type = document.getElementById('type').value;
  const status = document.getElementById('status').value;

  const data = { name, password, type, status };
  const url = `http://localhost:3000/api/${selectedServer}/users`;

  if (id) {
    await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } else {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  document.getElementById('userForm').reset();
  fetchUsers();
}

function editUser(id, name, password, type, status) {
  document.getElementById('userId').value = id;
  document.getElementById('name').value = name;
  document.getElementById('password').value = password;
  document.getElementById('type').value = type;
  document.getElementById('status').value = status;
}

async function deleteUser(id) {
  if (!selectedServer) {
    alert('Please select a server first.');
    return;
  }
  const url = `http://localhost:3000/api/${selectedServer}/users/${id}`;
  await fetch(url, { method: 'DELETE' });
  fetchUsers();
}

document.getElementById('userForm').addEventListener('submit', addOrUpdateUser);
document.getElementById('connectBtn').addEventListener('click', connectToServer);
fetchServers();
