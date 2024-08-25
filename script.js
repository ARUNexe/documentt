let containers = [];

function loadContainers() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            containers = data.containers;
            createContainerList();
            createContainerSections();
        })
        .catch(error => console.error('Error loading containers:', error));
}

function saveContainers() {
    fetch('data.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ containers: containers }),
    })
    .then(response => response.json())
    .then(data => console.log('Containers saved successfully'))
    .catch(error => console.error('Error saving containers:', error));
}

function addContainer() {
    const name = prompt("Enter container name:");
    if (name) {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        const newContainer = {
            id: id,
            name: name,
            input: '',
            output: '',
            audioCodecs: [],
            videoCodecs: [],
            referenceLinks: []
        };
        containers.push(newContainer);
        saveContainers();
        createContainerList();
        createContainerSections();
    }
}

function createContainerList() {
    const containerList = document.getElementById('container-list');
    containerList.innerHTML = '';
    containers.forEach(container => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${container.id}`;
        a.textContent = container.name.replace(' Container', '');
        li.appendChild(a);
        containerList.appendChild(li);
    });
}

function createContainerSections() {
    const containerSections = document.getElementById('container-sections');
    containerSections.innerHTML = '';
    containers.forEach(container => {
        const section = document.createElement('div');
        section.id = container.id;
        section.className = 'container-section';

        section.innerHTML = `
            <h2>${container.name}</h2>
            <div class="content-wrapper">
                <table>
                    <tr>
                        <th>Input/Output</th>
                        <th>Audio Codecs Supported <button class="add-codec" data-type="audio" data-container="${container.id}">+</button></th>
                        <th>Video Codecs Supported <button class="add-codec" data-type="video" data-container="${container.id}">+</button></th>
                    </tr>
                    <tr>
                        <td>Input: ${container.input}</td>
                        <td>${container.audioCodecs[0] || ''}</td>
                        <td>${container.videoCodecs[0] || ''}</td>
                    </tr>
                    <tr>
                        <td>Output: ${container.output}</td>
                        <td>${container.audioCodecs[1] || ''}</td>
                        <td>${container.videoCodecs[1] || ''}</td>
                    </tr>
                </table>
                <aside>
                    <h3>${container.name} Reference Links <button class="add-reference" data-container="${container.id}">+</button></h3>
                    <ul id="${container.id}-reference-links">
                        ${container.referenceLinks.map(link => `
                            <li><a href="${link.url}">${link.text}</a></li>
                        `).join('')}
                    </ul>
                </aside>
            </div>
        `;

        containerSections.appendChild(section);
    });

    document.querySelectorAll('.add-codec').forEach(button => {
        button.addEventListener('click', addCodec);
    });

    document.querySelectorAll('.add-reference').forEach(button => {
        button.addEventListener('click', addReference);
    });
}

function addCodec(event) {
    const type = event.target.dataset.type;
    const containerId = event.target.dataset.container;
    const container = containers.find(c => c.id === containerId);

    const codec = prompt(`Enter new ${type} codec:`);
    if (codec) {
        const rowNumber = parseInt(prompt(`Enter the row number to insert the codec (1 for input, 2 for output):`), 10);
        if (rowNumber === 1 || rowNumber === 2) {
            container[`${type}Codecs`][rowNumber - 1] = codec;
            saveContainers();
            createContainerSections();
        } else {
            alert("Invalid row number. Please enter 1 for input or 2 for output.");
        }
    }
}

function addReference(event) {
    const containerId = event.target.dataset.container;
    const name = prompt("Enter reference name:");
    const url = prompt("Enter reference URL:");
    if (name && url) {
        const container = containers.find(c => c.id === containerId);
        container.referenceLinks.push({ text: name, url: url });
        saveContainers();
        createContainerSections();
    }
}

function init() {
    loadContainers();
    document.getElementById('add-container').addEventListener('click', addContainer);
}

document.addEventListener('DOMContentLoaded', init);