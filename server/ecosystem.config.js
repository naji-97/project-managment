module.exports = {
  apps: [
    {
      name: "project-management",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
