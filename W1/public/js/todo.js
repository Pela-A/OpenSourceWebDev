// Fetch the todo.json data from the /todo endpoint
fetch('/todo.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const todoList = document.getElementById('todo-list');
        
        // Loop through the data/array and create list items for each todo
        data.map(todo => {
            // Create DOM element to be populated
            const listItem = document.createElement('li');

            // Assign item id
            listItem.id = `todo-${todo.id}`;
            // Format the content to display
            listItem.textContent = `${todo.title} - Completed: ${todo.completed ? 'Yes' : 'No'}`;
            
            // Append the new list item to the list
            todoList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
