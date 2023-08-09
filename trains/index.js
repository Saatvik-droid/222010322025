import express from "express";

const app = express();
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTE1NTY5NTEsImNvbXBhbnlOYW1lIjoiVHJhaW4gQ2VudHJhbCIsImNsaWVudElEIjoiNTY5NDIyZDQtOWQ2Ny00YjY5LTliZGEtNzM4OTYzYmVhZGQ4Iiwib3duZXJOYW1lIjoiIiwib3duZXJFbWFpbCI6IiIsInJvbGxObyI6IjIyMjAxMDMyMjAyNSJ9.TiZmZ-XUn0WdCSBB0htoMMgUyCq9BBBMKzEllh5VaFY";
let headers = {
  Authorization: `Bearer ${token}`,
};

const handle = (data) => {
  let res = [];
  data.forEach((train) => {
    if (
      train.departureTime.Hours > 1 ||
      train.departureTime.Minutes > 30 ||
      train.departureTime.Minutes + train.delayedBy > 30 ||
      (train.departureTime.Minutes == 30 && train.departureTime.Seconds > 0)
    ) {
      res.push(train);
    }
  });
  res.sort((a, b) => {
    if (a.price.sleeper != b.price.sleeper) {
      return a.price.sleeper - b.price.sleeper;
    }
    if (a.price.AC != b.price.AC) {
      return a.price.AC - b.price.AC;
    }
    if (a.seatsAvailable.sleeper != b.seatsAvailable.sleeper) {
      return b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;
    }
    if (a.seatsAvailable.AC != b.seatsAvailable.AC) {
      return b.seatsAvailable.AC - a.seatsAvailable.AC;
    }
    if (a.departureTime.Hours != b.departureTime.Hours) {
      return b.departureTime.Hours - a.departureTime.Hours;
    }
    if (
      a.departureTime.Minutes + a.delayedBy !=
      b.departureTime.Minutes + b.delayedBy
    ) {
      return (
        b.departureTime.Minutes +
        b.delayedBy -
        a.departureTime.Minutes +
        a.delayedBy
      );
    }
    if (a.departureTime.Seconds != b.departureTime.Seconds) {
      return b.departureTime.Seconds - a.departureTime.Seconds;
    }
  });
  return res;
};
app.get("/trains", async (req, res) => {
  let s = "";
  let val = await fetch("http://20.244.56.144/train/trains", { headers });
  val.json().then(async (r) => {
    if (r["message"].includes("token is expired")) {
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
      val.json().then(async (r) => {
        headers = {
          Authorization: `Bearer ${r["access_token"]}`,
        };
        val = await fetch("http://20.244.56.144/train/trains", { headers });
        val.json().then((r) => {
          s = handle(r);
          res.json(s);
        });
      });
    } else {
      s = handle(r);
      res.json(s);
    }
  });
});

app.listen(5001, () => {
  console.log(`Started on http://localhost:5001`);
});

