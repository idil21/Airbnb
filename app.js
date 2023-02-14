require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const ejs = require("ejs");

const conn = require("./dbService");
const { response } = require("express");
const app = express();

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const allAdverts = [];
  conn.query(
    "SELECT * FROM adverts INNER JOIN media on adverts.id=media.advert_id",
    (err, rows) => {
      if (!err) {
        rows.forEach((RowDataPacket) => {
          allAdverts.push({
            id: RowDataPacket.id,
            price_per_day: RowDataPacket.price_per_day,
            description: RowDataPacket.description,
            address: RowDataPacket.address,
            image_url: RowDataPacket.image_url,
          });
        });
        // console.log(allAdverts);
        res.render("home", { adverts: allAdverts });
      } else console.log(err);
    }
  );
  conn.query(
    `INSERT INTO logs (text) VALUES ('SELECT * FROM adverts INNER JOIN media on adverts.id=media.advert_id')`,
    (err, rows, fields) => {}
  );
});

app.get("/ilan/:id", (req, res) => {
  const ilanID = req.params.id;
  conn.query(
    `SELECT * FROM adverts INNER JOIN house ON adverts.house_id = house.id INNER JOIN media ON adverts.id = media.advert_id WHERE adverts.id = ${ilanID}`,
    (err, rows) => {
      if (!err) {
        res.render("advert", {
          price_per_day: rows[0].price_per_day,
          description: rows[0].description,
          address: rows[0].address,
          image1: rows[0].image_url,
          image2: rows[1].image_url,
          image3: rows[2].image_url,
          image4: rows[3].image_url,
          image5: rows[4].image_url,
          city_id: rows[0].city_id,
          total_bedrooms: rows[0].total_bedrooms,
          total_bathrooms: rows[0].total_bathrooms,
          num_guests: rows[0].num_guests,
          has_tv: rows[0].has_tv,
          has_kitchen: rows[0].has_kitchen,
          has_air_con: rows[0].has_air_con,
          has_heating: rows[0].has_heating,
          has_internet: rows[0].has_internet,
        });
        // console.log(rows);
      } else console.log(err);
    }
  );
  conn.query(
    `INSERT INTO logs (text) VALUES ('SELECT * FROM adverts INNER JOIN house ON adverts.house_id = house.id INNER JOIN media ON adverts.id = media.advert_id WHERE adverts.id = ${ilanID}')`,
    (err, rows, fields) => {}
  );
});

// app.delete("/delete/:id", (req, res) => {
//   const advertId = req.params.id;
//   const deleteQuery = "DELETE FROM adverts WHERE id = ?";
// const deleteQueryHouse = "DELETE FROM house WHERE id = ?";
//   conn.query(deleteQuery, [advertId], (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json({ success: true });
//     }
//   });

//   conn.query(
//     `INSERT INTO logs (text) VALUES ('DELETE FROM adverts WHERE id = ?')`,
//     (err, rows, fields) => {}
//   );
// });

app.post("/delete", (req, res) => {
  const silinecekIlanId = Number(req.body.silinecekIlanId);
  const deleteQuery = "DELETE FROM adverts WHERE id = ?";
  const deleteQueryHouse = "DELETE FROM house WHERE id = ?";

  conn.query(deleteQueryHouse, [silinecekIlanId], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
  conn.query(deleteQuery, [silinecekIlanId], (err, result) => {
    if (err) {
      console.log(err);
    } else {
    }
  });
});

app.get("/city/:name", async (req, res) => {
  const cityName = req.params.name;
  const advertsByCity = [];
  const query = `SELECT * FROM adverts_view WHERE city_id = (SELECT id FROM city WHERE name = ?)`;
  conn.query(query, [cityName], (err, rows) => {
    if (!err) {
      rows.forEach((RowDataPacket) => {
        advertsByCity.push({
          id: RowDataPacket.id,
          price_per_day: RowDataPacket.price_per_day,
          description: RowDataPacket.description,
          address: RowDataPacket.address,
          images: RowDataPacket.images.split(","),
        });
      });
      res.json({ adverts: advertsByCity });
    } else {
      console.log(err);
    }
  });
  conn.query(
    `INSERT INTO logs (text) VALUES ('SELECT * FROM adverts_view WHERE city_id = (SELECT id FROM city WHERE name = ${cityName})')`,
    (err, rows, fields) => {}
  );
});
app.get("/adverts/:houseType", async (req, res) => {
  const houseType = req.params.houseType;
  const advertsByType = [];
  conn.query(
    `SELECT adverts.*, GROUP_CONCAT(media.image_url) AS images
    FROM adverts
    JOIN house ON adverts.house_id = house.id
    JOIN media ON adverts.id = media.advert_id
    WHERE house.house_type = ?
    GROUP BY adverts.id`,
    [houseType],
    (err, rows) => {
      if (!err) {
        rows.forEach((RowDataPacket) => {
          advertsByType.push({
            id: RowDataPacket.id,
            price_per_day: RowDataPacket.price_per_day,
            description: RowDataPacket.description,
            address: RowDataPacket.address,
            images: RowDataPacket.images.split(","),
          });
        });
        res.json({ adverts: advertsByType });
      } else {
        console.log(err);
      }
    }
  );
  conn.query(
    `INSERT INTO logs (text) VALUES ('SELECT adverts.*, GROUP_CONCAT(media.image_url) AS images
    FROM adverts
    JOIN house ON adverts.house_id = house.id
    JOIN media ON adverts.id = media.advert_id
    WHERE house.house_type = ${houseType}
    GROUP BY adverts.id')`,
    (err, rows, fields) => {}
  );
});

app.post("/evsahibi", upload.array("images", 5), async (req, res) => {
  const images = req.files;
  // images.forEach((image) => {
  //   console.log(image.filename);
  //   console.log(image.path);
  //   console.log(image.mimetype);
  // });
  const {
    price_per_day,
    description,
    address,
    house_type,
    total_bedrooms,
    total_bathrooms,
    num_guests,
    has_tv,
    has_kitchen,
    has_air_con,
    has_heating,
    has_internet,
  } = req.body;
  // console.log(req.body);
  const user_id = req.session.user.id;
  const city_name = req.body.city_name;
  let city_id;
  let house_id;
  let advert_id;
  const insertCityQuery = `INSERT INTO city (name)
                           SELECT * FROM (SELECT ?) AS tmp
                           WHERE NOT EXISTS (
                           SELECT name FROM city WHERE name = ? ) LIMIT 1`;

  try {
    const result = await conn.query(insertCityQuery, [city_name, city_name]);
  } catch (err) {
    console.error(err);
  }
  const getCityId = new Promise((resolve, reject) => {
    conn.query(
      `SELECT id FROM city WHERE name = ?`,
      [city_name],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].id);
        }
      }
    );
    conn.query(
      `INSERT INTO logs (text) VALUES ('SELECT id FROM city WHERE name = ${city_name}')`,
      (err, rows, fields) => {}
    );
  });

  try {
    city_id = await getCityId;
  } catch (err) {
    console.error(err);
  }

  console.log("city_id = ", city_id);

  const createHouseQuery = `INSERT INTO house (house_type, total_bedrooms, total_bathrooms, num_guests, has_tv, has_kitchen,
                             has_air_con, has_heating, has_internet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const createHouseParams = [
    house_type,
    total_bedrooms,
    total_bathrooms,
    num_guests,
    has_tv,
    has_kitchen,
    has_air_con,
    has_heating,
    has_internet,
  ];
  try {
    const result2 = await conn.query(createHouseQuery, createHouseParams);
  } catch (err) {
    console.error(err);
  }
  const getHouseId = new Promise((resolve, reject) => {
    conn.query(
      `SELECT id FROM house ORDER BY id DESC LIMIT 1; `,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].id);
        }
      }
    );
    conn.query(
      `INSERT INTO logs (text) VALUES ('SELECT id FROM house ORDER BY id DESC LIMIT 1')`,
      (err, rows, fields) => {}
    );
  });

  try {
    house_id = await getHouseId;
  } catch (err) {
    console.error(err);
  }

  console.log("house_id =", house_id);

  const createAdvertQuery = `INSERT INTO adverts (price_per_day, description, address, city_id, user_id, house_id) VALUES (?, ?, ?, ?, ?, ?)`;
  const createAdvertParams = [
    price_per_day,
    description,
    address,
    city_id,
    user_id,
    house_id,
  ];
  try {
    const result3 = await conn.query(createAdvertQuery, createAdvertParams);
  } catch (err) {
    console.error(err);
  }
  const getAdvertId = new Promise((resolve, reject) => {
    conn.query(
      `SELECT id FROM adverts ORDER BY id DESC LIMIT 1; `,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].id);
        }
      }
    );
    conn.query(
      `INSERT INTO logs (text) VALUES ('SELECT id FROM adverts ORDER BY id DESC LIMIT 1')`,
      (err, rows, fields) => {}
    );
  });

  try {
    advert_id = await getAdvertId;
  } catch (err) {
    console.error(err);
  }
  console.log("advert_id= ", advert_id);
  if (images.length > 0) {
    const sql = "INSERT INTO media (advert_id,image_url) VALUES (?, ?)";
    const advertId = advert_id;
    const values = images.map((image) => ["/public/images/" + image.filename]);
    values.forEach((value) => {
      console.log(value);
    });
    values.forEach((value) => {
      conn.query(sql, [advertId, value], (err, rows) => {
        if (err) throw err;
      });
      conn.query(
        `INSERT INTO logs (text) VALUES ('Dosya yükleme hatası!')`,
        (err, rows, fields) => {}
      );
    });
  } else {
    res.send("Dosya yükleme hatası!");
  }
  res.redirect("/evsahibi");
});

app.get("/evsahibi", async (req, res) => {
  const advertResults = [];
  const user_data = [];
  const number_of_advert = [];

  if (!req.session.user) {
    res.redirect("/");
    return;
  }

  const userId = req.session.user.id;

  const advertofuser_sql =
    "(SELECT user_id, COUNT(*) as advert_count FROM adverts WHERE user_id = ? GROUP BY user_id)";

  conn.query(advertofuser_sql, userId, (error, rows) => {
    if (!error) {
      rows.forEach((RowDataPacket) => {
        number_of_advert.push({
          advert_count: RowDataPacket.advert_count,
        });
      });
      conn.query(
        `INSERT INTO logs (text) VALUES ('SELECT user_id, COUNT(*) as advert_count FROM adverts WHERE user_id = ${userId} GROUP BY user_id')`,
        (err, rows, fields) => {}
      );
    } else console.log(error);
  });

  const user_sql = "(SELECT * FROM users WHERE id = ?)";
  conn.query(
    `INSERT INTO logs (text) VALUES ('SELECT * FROM users WHERE id = ${userId}')`,
    (err, rows, fields) => {}
  );
  conn.query(user_sql, userId, (error, rows) => {
    if (!error) {
      rows.forEach((RowDataPacket) => {
        user_data.push({
          name: RowDataPacket.name,
          email: RowDataPacket.email,
          phone_number: RowDataPacket.phone_number,
          created_at: RowDataPacket.created_at,
        });
        console.log(user_data);
      });
    } else console.log(error);
  });
  const sql =
    "(SELECT * FROM adverts INNER JOIN media ON adverts.id=media.advert_id WHERE user_id = ?)";
  conn.query(
    `INSERT INTO logs (text) VALUES ('SELECT * FROM adverts INNER JOIN media ON adverts.id=media.advert_id WHERE user_id = ${userId}')`,
    (err, rows, fields) => {}
  );
  conn.query(sql, userId, (error, rows) => {
    if (!error) {
      rows.forEach((RowDataPacket) => {
        advertResults.push({
          id: RowDataPacket.advert_id,
          price_per_day: RowDataPacket.price_per_day,
          description: RowDataPacket.description,
          address: RowDataPacket.address,
          image_url: RowDataPacket.image_url,
        });
      });
      console.log(userId);
      // console.log(advertResults);

      res.render("evsahibi", {
        adverts2: advertResults,
        adverts3: user_data,
        number_of_advert: number_of_advert,
      });
    } else console.log(error);
  });
});

app.post("/register", (req, res) => {
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    res.json({ success: false, message: "All fields are required." });
  } else {
    conn.query(
      "INSERT IGNORE INTO users (name, password, email) VALUES (?, ?, ?)",
      [name, password, email],
      (error, results) => {
        if (error) {
          throw error;
        } else if (results.affectedRows === 0) {
          res.json({
            success: false,
            message: "User with this email already exists.",
          });
        } else {
          res.json({ success: true });
        }
      }
    );
    conn.query(
      `INSERT INTO logs (text) VALUES ('INSERT IGNORE INTO users (name, password, email) VALUES (${name}, ${password}, ${email}})')`,
      (err, rows, fields) => {}
    );
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  conn.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        req.session.user = result[0];
        res.send({ success: true });
      } else {
        res.json({ success: false, message: "Invalid email or password." });
      }
    }
  );
  conn.query(
    `INSERT INTO logs (text) VALUES ('SELECT * FROM users WHERE email = ${email} AND password = ${password}')`,
    (err, rows, fields) => {}
  );
});

app.get("/logout", function (req, res) {
  if (!req.session.user) {
    conn.query(
      `INSERT INTO logs (text) VALUES ('You must be logged in to log out.')`,
      (err, rows, fields) => {}
    );
    res.send({ success: false, message: "You must be logged in to log out." });
    return;
  }
  req.session.destroy(function (error) {
    if (error) {
      conn.query(
        `INSERT INTO logs (text) VALUES ('There was an error during the logout process.')`,
        (err, rows, fields) => {}
      );
      res.send({
        success: false,
        message: "There was an error during the logout process.",
      });
      return;
    }
    conn.query(
      `INSERT INTO logs (text) VALUES ('You have been successfully logged out.')`,
      (err, rows, fields) => {}
    );
    res.send({
      success: true,
      message: "You have been successfully logged out.",
    });
  });
});

app.get("/admin", async (req, res) => {
  conn.query(
    `INSERT INTO logs (text) VALUES ('admin sayfasına giriş yapıldı')`,
    (err, rows, fields) => {}
  );
  res.render("admin");
});
app.post("/admin", (req, res) => {
  const sqlQuery = req.body.sqlQuery;
  console.log(sqlQuery);
  conn.query(sqlQuery, (err, rows) => {
    if (!err) {
      // Get the column names from the first row
      const columns = Object.keys(rows[0]);
      conn.query(
        `INSERT INTO logs (text) VALUES ('${sqlQuery}')`,
        (err, rows, fields) => {}
      );
      res.render("adminSql", { rows: rows, columns: columns });
      console.log(rows);
    } else {
      console.log(err);
      conn.query(
        `INSERT INTO logs (text) VALUES ('hatalı veya eksik sorgu')`,
        (err, rows, fields) => {}
      );
      res.render("admin");
    }
  });
});

app.get("/admin/sqlOutput", (req, res) => {
  conn.query(
    `INSERT INTO logs (text) VALUES ('admin sayfası sorgu sonucu görüntülendi')`,
    (err, rows, fields) => {}
  );
  res.render("adminSql");
});

app.get("/admin/logs", (req, res) => {
  conn.query(`SELECT * FROM logs`, (err, rows) => {
    if (!err) {
      // Get the column names from the first row
      const columns = Object.keys(rows[0]);
      res.render("adminLogs", { rows: rows, columns: columns });
    } else {
      console.log(err);
    }
  });
});

app.listen(process.env.PORT, () => console.log("app is running"));
