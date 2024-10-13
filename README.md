# Write-Up

Welcome to the Write-Up repository! This project is a SaaS platform that leverages Large Language Models (LLMs) to assess and improve your writing skills for TOEFL and IELTS exams.

## About the Project

Write-Up is designed to:
- Evaluate your writing based on TOEFL and IELTS criteria
- Provide detailed feedback on your writing
- Track your progress over time
- Offer personalized suggestions for improvement

## Repository Structure

This repository maintains four long-term branches:

1. `main`: The production-ready branch
2. `dev`: The development branch for integrating new features
3. `backend`: Dedicated to backend development
4. `frontend`: Dedicated to frontend development

## Release Strategy

We follow the Semantic Versioning (SemVer) convention for our releases:

- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality additions
- PATCH version for backwards-compatible bug fixes

Example: 1.2.3
- 1: MAJOR version
- 2: MINOR version
- 3: PATCH version

Releases will be tagged and merged into the `main` branch after thorough testing in the `dev` branch.

## Getting Started

(Instructions for setting up the project locally will be added here)

## Contributing

We welcome contributions to Write-Up! Here's how you can contribute:

1. Take an issue: Choose an open issue from our issue tracker.

2. Create a branch:
   - For frontend tasks: Create a branch from the `frontend` branch
   - For backend tasks: Create a branch from the `backend` branch
   - If the task involves both frontend and backend: Create a branch from the `dev` branch
   - For hotfixes: Create a branch from the `main` branch

   Name your branch according to the issue you're working on, e.g., `feature/issue-123` or `bugfix/issue-456`.

3. Make your changes: Implement the feature or fix the bug in your branch.

4. Raise a Pull Request (PR): Once your changes are ready, create a pull request to merge your branch into the appropriate target branch.

5. Code Review: Wait for the maintainers to review your PR. Make any requested changes if necessary.

6. Merge: Once approved, your PR will be merged into the target branch.

Please ensure you follow our coding standards and write appropriate tests for your changes. For more detailed guidelines, refer to our CONTRIBUTING.md file.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

Copyright (C) 2023 Write-Up

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.