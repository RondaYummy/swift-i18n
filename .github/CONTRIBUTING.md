# Vue I18n Contributing Guide

- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Financial Contribution](#financial-contribution)

## General Guidelines

Thanks for understanding that English is used as a shared language in this repository.
Maintainers do not use machine translation to avoid miscommunication due to error in translation.
If description of issue / PR are written in non-English languages, those may be closed.

It is of course fine to use non-English language, when you open a PR to translate documents and communicates with other users in same language.

## Pull Request Guidelines

- The `main` branch is the latest stable version release. All development should be done in dedicated branches.

- Checkout a topic branch from the relevant branch, e.g. `main`, and merge back against that branch.

- Work in the `src` folder and **DO NOT** checkin `dist` in the commits.

- If adding new feature:

  - Add accompanying test case.
  - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.

- If fixing a bug:

  - Provide detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

- It's OK to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

### Work Step Example

- Fork the repository from [swift-i18n](https://github.com/RondaYummy/swift-i18n) !
- Create your topic branch from `main`: `git branch my-new-topic origin/main`
- Add codes and pass tests !
- Commit your changes: `git commit -am 'Add some topic'`
- Push to the branch: `git push origin my-new-topic`
- Submit a pull request to `main` branch of `swift-i18n` repository !

## Development Setup

After cloning the repo, run:

```bash
$ npm i # install the dependencies of the project
```

A high level overview of tools used:

- [TypeScript](https://www.typescriptlang.org/) as the development language
- [Rollup](https://rollupjs.org) for bundling
- [Vitest](https://vitest.dev/) for unit testing
- [Playwright](https://playwright.dev/) for e2e testing
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io/) for code formatting

## Contributing Tests

Unit tests are collocated with directories named `test`. Consult the [Jest docs](https://jestjs.io/docs/en/using-matchers) and existing test cases for how to write new test specs. Here are some additional guidelines:

Use the minimal API needed for a test case. For example, if a test can be written without involving the reactivity system ra component, it should be written so. This limits the test's exposure to changes in unrelated parts and makes it more stable.

## Financial Contribution

As a pure community-driven project without major corporate backing, we also welcome financial contributions via GitHub Sponsors

- [Become a backer or sponsor on GitHub Sponsors](https://github.com/sponsors/RondaYummy)

Funds donated via GitHub Sponsors go to support RondaYummy full-time work on swift-i18n.

## Credits

Thank you to all the people who have already contributed to swift-i18n project and my OSS work !
