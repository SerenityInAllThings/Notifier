export const getWebserverPort = () => {
  const port = process.env.PORT;
  if (!port) {
    const defaultPort = 3000;
    console.warn(
      "PORT environment variables is not set, using default port:",
      defaultPort
    );
    return defaultPort;
  }
  const parsedPort = parseInt(port);
  if (isNaN(parsedPort)) {
    const error = "PORT is not a number, got " + port;
    console.error(error);
    throw new Error(error);
  }
  return parsedPort;
};
