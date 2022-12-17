'use strict';

const mainEl = document.getElementById('main');
const formEl = document.getElementById('form');
const searchEl = document.getElementById('search');

const displayUI = async (user) => {
  const {
    avatar_url,
    bio,
    followers,
    following,
    login,
    public_repos,
    repos_url,
  } = user;
  const getRepos = await getInfo(repos_url);
  const getFiveRepos = getRepos.slice(0, 5);

  const html = `
	<div class="card">
		<div>
			<img src="${avatar_url}" alt="${login}" class="avatar">
		</div>
		<div class="user-info">
			<h2>${login}</h2>
			<p>${bio}</p>
			<ul>
				<li>${followers} <strong>Followers</strong></li>
				<li>${following} <strong>Following</strong></li>
				<li>${public_repos} <strong>Repos</strong></li>
			</ul>

			<div id="repos">
			${getFiveRepos
        .map((repo) => {
          return `
			<a class="repo" href="${repo.html_url}" target="_blank">${repo.name}</a>		
			`;
        })
        .join(' ')}
			</div>
		</div>
	</div>
	`;

  mainEl.innerHTML = html;
};

const getInfo = async (url) => {
  const res = await fetch(url);
  const user = await res.json();

  return user;
};

////////////////////////////////////////////////////////
formEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userValue = searchEl.value;
  let url = 'https://api.github.com/users/';

  if (!userValue) return;

  url = `${url}${userValue}`;
  searchEl.value = '';
  const data = await getInfo(url);

  if (data.message) {
    mainEl.innerHTML = `
		<div class="card">
			<h1>No profile with this username</h1>
		</div>
		`;

    return;
  }

  displayUI({ ...data });
});
