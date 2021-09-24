import express from "express";
import React from "react";
import { ServerStyleSheet } from "styled-components";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./src/App";
import path from "path";
import fs from "fs";

global.window = {};

const app = express();

app.use(express.static("./build", { index: false }));

const articles = [
  { title: "Article 1", author: "Bob" },
  { title: "Article 2", author: "Betty" },
  { title: "Article 3", author: "Frank" },
];

app.get("/api/articles", (req, res) => {
  const loadedArticles = articles;
  res.json(loadedArticles);
});

app.get("/*", (req, res) => {
  const sheet = new ServerStyleSheet();

  const reactApp = renderToString(
    sheet.collectStyles(
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    )
  );

  const templateFile = path.resolve("./build/index.html");
  fs.readFile(templateFile, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }

    const loadedArticles = articles;

    return res.send(
      data
        .replace(
          '<div id="root"></div>',
          `<script>window.preloadedArticles = ${JSON.stringify(
            loadedArticles
          )};</script><div id="root">${reactApp}</div>`
        )
        .replace("{{ styles }}", sheet.getStyleTags())
    );
  });
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
