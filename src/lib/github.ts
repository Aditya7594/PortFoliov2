// Utility to fetch GitHub repo details for project cards
export async function fetchGitHubRepoData(repoUrl: string) {
  try {
    // Extract owner/repo from URL
    const match = repoUrl.match(/github.com\/(.+?)\/(.+?)(?:\.git)?$/);
    if (!match) return null;
    const [_, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const res = await fetch(apiUrl);
    if (!res.ok) return null;
    const data = await res.json();
    // Optionally fetch languages
    const langRes = await fetch(`${apiUrl}/languages`);
    const languages = langRes.ok ? await langRes.json() : {};
    // Optionally fetch topics
    const topicsRes = await fetch(`${apiUrl}/topics`, { headers: { Accept: 'application/vnd.github.mercy-preview+json' } });
    const topics = topicsRes.ok ? (await topicsRes.json()).names : [];
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      openIssues: data.open_issues_count,
      description: data.description,
      homepage: data.homepage,
      languages: Object.keys(languages),
      topics,
      license: data.license?.spdx_id,
      pushedAt: data.pushed_at,
      createdAt: data.created_at,
      githubUrl: data.html_url,
    };
  } catch (e) {
    return null;
  }
}
