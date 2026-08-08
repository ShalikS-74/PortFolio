const GITHUB_USER = 'ShalikS-74';
const GITLAB_USER = 'ShalikS-74';
const GH_TOKEN = process.env.GITHUB_TOKEN;

async function ghGraphQL(query, variables) {
  if (!GH_TOKEN) {
    throw new Error('GITHUB_TOKEN is required to fetch GitHub stats.');
  }

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${GH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();

  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function getGithubStats() {
  const { user } = await ghGraphQL(
    `query($login:String!){ user(login:$login){ createdAt } }`,
    { login: GITHUB_USER },
  );
  const startYear = new Date(user.createdAt).getFullYear();
  const currentYear = new Date().getFullYear();

  let totalCommits = 0;
  let totalPRs = 0;

  for (let year = startYear; year <= currentYear; year += 1) {
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;
    const data = await ghGraphQL(
      `query($login:String!,$from:DateTime!,$to:DateTime!){
        user(login:$login){
          contributionsCollection(from:$from, to:$to){
            totalCommitContributions
            totalPullRequestContributions
          }
        }
      }`,
      { login: GITHUB_USER, from, to },
    );

    totalCommits +=
      data.user.contributionsCollection.totalCommitContributions;
    totalPRs +=
      data.user.contributionsCollection.totalPullRequestContributions;
  }

  const repoData = await ghGraphQL(
    `query($login:String!){
      user(login:$login){
        repositories(privacy: PUBLIC){ totalCount }
      }
    }`,
    { login: GITHUB_USER },
  );

  const now = new Date();
  const from21 = new Date(
    now.getTime() - 21 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const calendarData = await ghGraphQL(
    `query($login:String!,$from:DateTime!,$to:DateTime!){
      user(login:$login){
        contributionsCollection(from:$from, to:$to){
          contributionCalendar{
            weeks{ contributionDays{ date contributionCount } }
          }
        }
      }
    }`,
    { login: GITHUB_USER, from: from21, to: now.toISOString() },
  );
  const allDays =
    calendarData.user.contributionsCollection.contributionCalendar.weeks
      .flatMap((week) => week.contributionDays)
      .map((day) => day.contributionCount);

  return {
    totalCommits,
    totalPRs,
    totalRepos: repoData.user.repositories.totalCount,
    recentActivity: allDays.slice(-14),
  };
}

async function getGitlabStats() {
  const userResponse = await fetch(
    `https://gitlab.com/api/v4/users?username=${GITLAB_USER}`,
  );
  const users = await userResponse.json();
  if (!users.length) return { totalRepos: 0 };

  const projectsResponse = await fetch(
    `https://gitlab.com/api/v4/users/${users[0].id}/projects?per_page=1`,
  );

  return { totalRepos: Number(projectsResponse.headers.get('x-total')) || 0 };
}

async function main() {
  const [github, gitlab] = await Promise.all([
    getGithubStats(),
    getGitlabStats(),
  ]);

  const stats = {
    generatedAt: new Date().toISOString(),
    github: {
      username: GITHUB_USER,
      totalCommits: github.totalCommits,
      totalPRs: github.totalPRs,
      totalRepos: github.totalRepos,
      recentActivity: github.recentActivity,
    },
    gitlab: {
      username: GITLAB_USER,
      totalRepos: gitlab.totalRepos,
    },
  };

  const fs = await import('node:fs/promises');
  await fs.mkdir('public/data', { recursive: true });
  await fs.writeFile('public/data/stats.json', JSON.stringify(stats, null, 2));
  console.log('Wrote public/data/stats.json:', stats);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
