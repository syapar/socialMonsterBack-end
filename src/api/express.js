import Express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

export const app = new Express();
const port = 4000;

export const init = () => {
  app.use(Express.static(path.join(__dirname, '../../build')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.listen(port, error => {
    /* eslint-disable no-console */
    if (error) {
      console.error(error);
    } else {
      console.info(
        '🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.',
        port,
        port
      );
    }
    /* eslint-enable no-console */
  });
};
