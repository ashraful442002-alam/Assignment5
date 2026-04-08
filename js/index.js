let allIssues = [];
let currentFilter = 'all';

if (!localStorage.getItem('isLoggedIn')) {
  window.location.href = 'login.html';
}

function fetchIssues() {
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('issuesGrid').innerHTML = '';

  fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      allIssues = data.data || [];
      renderIssues(allIssues);
    })
    .catch(function(error) {
      console.error("Error fetching issues:", error);
      document.getElementById('issuesGrid').innerHTML = `
        <p class="col-span-4 text-center text-red-500 py-10">Failed to load issues. Please try again.</p>`;
    })
    .finally(function() {
      document.getElementById('loading').classList.add('hidden');
    });
}

function renderIssues(issues) {
  const grid = document.getElementById('issuesGrid');
  grid.innerHTML = '';

  if (issues.length === 0) {
    grid.innerHTML = `<p class="col-span-4 text-center text-gray-500 py-12">No issues found</p>`;
    return;
  }

  document.getElementById('issueCount').textContent = `${issues.length} Issues`;

  issues.forEach(issue => {
    const isOpen = issue.status === 'open';
    const borderColor = isOpen ? 'border-emerald-500' : 'border-purple-500';

    const cardHTML = `
      <div onclick="showIssueModal(${issue.id})" 
           class="issue-card bg-white border ${borderColor} border-t-4 rounded-xl overflow-hidden cursor-pointer">
           
           <div class="bg-gray-50 px-5 py-3 text-xs text-gray-500 flex justify-between">
          <span>${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Jan 15, 2024'}</span>
          <span class="${isOpen ? 'text-emerald-600' : 'text-purple-600'} font-medium">
            ${isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        <div class="p-5">
          
          <h3 class="font-semibold text-lg line-clamp-2 mb-2">${issue.title}</h3>
          <p class="text-gray-600 text-sm line-clamp-3 mb-4">${issue.description || 'No description provided'}</p>
          
          <div class="flex flex-wrap gap-2 mb-4">
            ${issue.labels ? issue.labels.map(label => `
              <span class="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">${label}</span>
            `).join('') : ''}
          </div>

          <div class="flex justify-between items-center text-sm">
            <div class="text-gray-500">by <span class="font-medium">${issue.author || 'john_doe'}</span></div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 text-xs font-medium rounded-full 
                ${issue.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 
                  issue.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}">
                ${issue.priority || 'MEDIUM'}
              </span>
            </div>
          </div>
        </div>
        
      </div>
    `;
    grid.innerHTML += cardHTML;
  });
}

function switchTab(filter, button) {
  currentFilter = filter;
  
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active-tab');
  });
  button.classList.add('active-tab');

  let filteredIssues = allIssues;

  if (filter === 'open') {
    filteredIssues = allIssues.filter(i => i.status === 'open');
  } else if (filter === 'closed') {
    filteredIssues = allIssues.filter(i => i.status === 'closed');
  }

  renderIssues(filteredIssues);
}

function showIssueModal(id) {
  const issue = allIssues.find(i => i.id === id);
  if (!issue) return;

  const modal = document.getElementById('issueModal');
  const body = document.getElementById('modalBody');
  const title = document.getElementById('modalTitle');

  title.textContent = issue.title;

  body.innerHTML = `
    <p class="text-gray-700 leading-relaxed">${issue.description || 'No description available.'}</p>
    <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
      <div><strong>Status:</strong> ${issue.status}</div>
      <div><strong>Priority:</strong> ${issue.priority}</div>
      <div><strong>Author:</strong> ${issue.author}</div>
      <div><strong>Created:</strong> ${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}</div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('issueModal').classList.add('hidden');
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  
  if (!query) {
    switchTab(currentFilter, document.querySelector('.active-tab'));
    return;
  }

  const filtered = allIssues.filter(issue => 
    issue.title.toLowerCase().includes(query) || 
    (issue.description && issue.description.toLowerCase().includes(query))
  );

  renderIssues(filtered);
});

window.onload = fetchIssues;
