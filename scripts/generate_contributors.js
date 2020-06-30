#!/usr/bin/env node

/*
 * This script fetches a maximum of PAGE_COUNT * 30 contributors and writes
 * their usernames and url to the Contributors.md file.
 */

const fetch = require('node-fetch');
const fs = require('fs');

const PAGE_COUNT = 4;
const FILE_NAME = "Contributors.md";
const BASE_URL = "https://api.github.com/repos/sb2nov/mac-setup/contributors?page=";
const HEADER = `# Contributors

Thank you everyone that have contributed to creating this awesome guide. Here are the names of a few; for the full list please visit the [GitHub Contributor page](https://github.com/sb2nov/mac-setup/graphs/contributors).

`;

const fetchContributor = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err);
  }
};

const promises = [...Array(PAGE_COUNT).keys()]
  .map(i => i + 1)
  .map(i => `${BASE_URL}${i}`)
  .map(fetchContributor);

Promise.all(promises).then(contributors => {
  const contributorsMarkdown = contributors
    .flatMap(c => c)
    .map(c => `- [${c.login}](${c.html_url})`)
    .join('\n');

  const result = HEADER + contributorsMarkdown + '\n';

  fs.writeFile(FILE_NAME, result, (err) => {
    if (err) return console.error(err);
  });
});
