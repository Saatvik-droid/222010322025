import express from "express";

const app = express();
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTE1NTY5NTEsImNvbXBhbnlOYW1lIjoiVHJhaW4gQ2VudHJhbCIsImNsaWVudElEIjoiNTY5NDIyZDQtOWQ2Ny00YjY5LTliZGEtNzM4OTYzYmVhZGQ4Iiwib3duZXJOYW1lIjoiIiwib3duZXJFbWFpbCI6IiIsInJvbGxObyI6IjIyMjAxMDMyMjAyNSJ9.TiZmZ-XUn0WdCSBB0htoMMgUyCq9BBBMKzEllh5VaFY";
let headers = {
  Authorization: `Bearer ${token}`,
};
app.get("/trains", async (req, res) => {
  console.log(headers);
  let val = await fetch("http://20.244.56.144/train/trains", { headers });
  val.json().then(async (r) => {
    if (r["message"].includes("token is expired")) {
      console.log("new token");
      const postData = {
        companyName: "Train Central",
        clientID: "569422d4-9d67-4b69-9bda-738963beadd8",
        ownerName: "Saatvik",
        ownerEmail: "sramani@gitam.in",
        rollNo: "222010322025",
        clientSecret: "fdwUzWHRihFDPRHB",
      };
      const requestOptions = {
        method: "POST",
        body: JSON.stringify(postData),
      };
      val = await fetch("http://20.244.56.144/train/auth", requestOptions);
      val.json().then(
        (r) =>
          (headers = {
            Authorization: `Bearer ${token}`,
          })
      );
      val = await fetch("http://20.244.56.144/train/trains", { headers });
      val.json().then((r) => console.log(r));
    } else {
      console.log(r);
    }
  });
  res.sendStatus(200);
});

app.listen(5000, () => {
  console.log(`Started on http://localhost:5000`);
});

