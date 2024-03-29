import React from "react";
import useDataSSR from "../useDataSSR";

const Articles = () => {
  const articles = useDataSSR("articles", () => {
    console.log("No preloaded articles found, loading from server");
    return fetch("http://localhost:8080/api/articles").then((response) =>
      response.json()
    );
  });

  return (
    <div>
      <h1>Articles</h1>
      {articles &&
        articles.map((article) => (
          <div key={article.title}>
            <h3>{article.title}</h3>
            <p>{article.author}</p>
          </div>
        ))}
    </div>
  );
};

export default Articles;
