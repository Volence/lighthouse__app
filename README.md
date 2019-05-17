# lighthouse__app
A little app to run audits on a site and present them to a front end

Contains a backend made with node, graphql, express, and some leftover restful junk (that was used before graphql).
Also contains a frontend made with react, victorygraph, and apollo client

You can find the most up to date version (usually) [here](https://volence.dev/lighthouse_app/)

## Changelog:

### 5/17/2019:
Server:
- Seperated the database schema for the console error audits. There are now 2, one for the audit count (which will contain multiple everytime the audits are run) and one that contains the list of errors and summary (this will be a single item that's over written every time an audit happens).
- Updated the graphql schema so that both of those requests can be seperate
- Updated the console information when running all audits
- Updated dependencies (graphql, lighthouse, mongoose, puppeteer)

Client:
- Added the new Metrics graphs
- Changed styling a bit to be slightly less ugly (still super ugly)
- Updated the graphql queries and data to for the updated database schema requests (less information coming back to client, more optimized).
- Changed the design from 3 different sites to 1 site with its 3 pages
- Cleaned up/removed a few different hooks being used, less clutter and more optimized
- Updated dependencies (graphql, victorycharts)
- Changed some coloring
