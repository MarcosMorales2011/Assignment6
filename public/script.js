document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const userList = document.getElementById('userList');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;

        const res = await fetch('/api/add-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, age }),
        });

        const user = await res.json();
        const li = document.createElement('li');
        li.textContent = `${user.name}, ${user.age} years old`;
        userList.appendChild(li);

        form.reset();
    });

    // Load existing users
    fetch('/api/users')
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.name}, ${user.age} years old`;
                userList.appendChild(li);
            });
        });
});
