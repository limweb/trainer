var Canvas = require("canvas");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var useragent = require("express-useragent");
var fs = require("fs");
var app = express();
var faceapi = require("face-api.js");
var commons = require("./commons");

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true
  })
);
app.use(
  bodyParser.json({
    limit: "50mb"
  })
);
app.use(cors());
app.use(useragent.express());

app.get("/", (req, res) => {
  res.send("Hello World");
});

async function run(QUERY_IMAGE) {
  console.log("---------run---------------");
  await commons.faceDetectionNet.loadFromDisk("./weights");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("./weights");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("./weights");
  await faceapi.nets.ageGenderNet.loadFromDisk("./weights");

  const queryImage = await commons.canvas.loadImage(QUERY_IMAGE);
  console.log("queryImage-->", queryImage);
  const resultsQuery = await faceapi
    .detectAllFaces(queryImage, commons.faceDetectionOptions)
    .withFaceLandmarks()
    .withAgeAndGender()
    .withFaceDescriptors();
  console.log("length-->", resultsQuery.length);
  let l = resultsQuery.length;
  if (l > 1) {
    for (let index = 0; index < l; index++) {
      console.log(index, "--->", resultsQuery[index].gender);
    }

    return {
      isSuccessed: false
    };
  } else {
    console.log(resultsQuery[0].gender);
    return {
      isSuccessed: true,
      gender: resultsQuery[0].gender,
      descriptor: resultsQuery[0].descriptor
    };
  }
  // console.log(resultsQuery[0].descriptor);
}

app.post("/upload", function(req, res) {
  // console.log("---req--", req.body.imgData);
  let isUrl = req.body.isUrl;
  var querydata = "";
  if (isUrl) {
    querydata = req.body.imgData;
  } else {
    querydata = "data:image/png;base64," + req.body.imgData;
  }
  let ID = req.body.ID;
  let Name = req.body.name;
  if (querydata) {
    run(querydata)
      .then(rs => {
        if (rs.isSuccessed) {
          rs.id = ID;
          rs.name = Name;
          res.send(JSON.stringify(rs));
        } else {
          res.send({
            isSuccessed: false,
            error: "image have more faces"
          });
        }
      })
      .catch(err => console.log);
  } else {
    res.send({
      isSuccessed: false,
      error: "not imageData"
    });
  }

  // var img = new Canvas.Image();
  // img.onload = function() {
  //   var w = img.width;
  //   var h = img.height;
  //   var canvas = Canvas.createCanvas(w, h);
  //   var ctx = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0);

  //   var out = fs.createWriteStream(__dirname + "/crop.jpg");
  //   var stream = canvas.createJPEGStream({
  //     bufsize: 2048,
  //     quality: 80
  //   });

  //   stream.on("data", function(chunk) {
  //     out.write(chunk);
  //   });

  //   stream.on("end", function() {
  //     out.end();
  //     res.send("upload successed!");
  //   });
  // };

  // img.onerror = function(err) {
  //   res.send(err);
  // };

  // img.src = base64Data;
});

if (!module.parent) {
  app.listen(8000);
  console.log("Express started on port 8000");
}
