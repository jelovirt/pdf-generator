# DITA-OT PDF plug-in generator ![Node.js CI] ![Netlify Status]

DITA-OT PDF plug-in generator is a TypeScript program that generates DITA-OT plug-ins that extend the default PDF2 plug-in.

## Development

1.  Install dependencies
    ```sh
    > nvm use
    > npm install
    ```
2.  Start development server
    ```sh
    > npm start
    ```
    Generator UI is available at http://localhost:1234.

### Testing

1.  Run unit-tests
    ```sh
    > npm test
    ```

## Distribution

1.  Install dependencies
    ```sh
    > nvm use
    > npm install
    ```
2.  Run distribution build
    ```sh
    > npm run build
    ```
    Distribution files are available in `dist` directory.

## Donating

Support this project and others by [@jelovirt](https://github.com/jelovirt) via [Paypal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=jarno%40elovirta%2ecom&lc=FI&item_name=Support%20Open%20Source%20work&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted).

## License

DITA-OT PDF plug-in generator is licensed for use under the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).

[netlify status]: https://api.netlify.com/api/v1/badges/55797fd8-f3be-41c7-b252-c52de60e3917/deploy-status
[node.js ci]: https://github.com/jelovirt/pdf-generator/workflows/Node.js%20CI/badge.svg
