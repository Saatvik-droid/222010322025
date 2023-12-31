import express from "express";

const app = express();

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function fetchAllData(urls) {
  const promises = urls.map((url) => fetchData(url));
  const results = await Promise.all(promises);
  return results;
}
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout after ${ms} milliseconds`));
    }, ms);
  });
}

app.get("/numbers", async (req, res) => {
  let urlArray = req.query.url;
  if (!Array.isArray(urlArray)) {
    urlArray = [urlArray];
  }
  let newUrlArray = [];
  let nums = [];
  urlArray.forEach(async (url, i) => {
    console.log(url);
    try {
      url = new URL(url);
      newUrlArray.push(url);
    } catch (_) {
      console.log("Invalid");
    }
  });

  const promises = newUrlArray.map((url) =>
    Promise.race([fetchData(url), timeout(5000)])
  );
  const fetchedData = await Promise.all(promises);
  console.log(fetchedData);
  fetchedData.forEach((numbers) => {
    console.log(numbers["numbers"]);
    nums.push(...numbers["numbers"]);
  });
  const uniqueArray = [...new Set(nums)];

  // Step 2: Sort the array in ascending order
  uniqueArray.sort((a, b) => a - b);

  res.json({
    numbers: uniqueArray,
  });
});

app.listen(5000, () => {
  console.log(`Started on http://localhost:5000`);
});

