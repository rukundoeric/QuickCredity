<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />

    <title>Mini App</title>

    <style>
      body {
        background-color: white;
      }
      div.user-photo {
        margin: 1em auto;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        overflow: hidden;
      }
      .select {
        margin-bottom: 2.5em;
      }
      .details {
        color: white;
        background-color: #6200ee;
        font-size: 1.3em;
        margin-top: 4em;
        padding: 0.5em 1em;
        border-radius: 10px;
      }
      .details p {
        margin: 0.3em;
      }
      #outcome {
        position: absolute;
        right: 2.2em;
        bottom: 6.5em;
        width: 100px;
        text-align: center;
      }
      #outcome h3 {
        padding: 1em;
        background-color: white;
        border-radius: 10%;
        margin: 0;
      }
      #outcome p {
        height: 40px;
        color: white;
        border-bottom: 5px solid white;
        font-size: 2em;
        padding: 0.5em 0;
        margin: 0;
      }
      #oracle {
        margin-top: 2.5em;
        border: 1px solid #333;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <button class="mdc-icon-button material-icons" id="filter-query">
      filter_list
    </button>
    <div class="select">
      <select class="select-text" id="select-text">
        <option selected disabled value="0">Select user</option>
      </select>
    </div>
    <div class="user-photo">
      <img
        src="https://via.placeholder.com/150

C/O https://placeholder.com/"
        alt="User Photo"
      />
    </div>
    <div class="details mdc-elevation--z3">
      <p>
        <span class="prop" data-age="Age:">Age</span
        ><span class="value" data-age-value="">&nbsp;40</span>
      </p>
      <p>
        <span class="prop" data-height="Height:">Height</span
        ><span class="value" data-height-value="">&nbsp; 6</span>
      </p>
      <p>
        <span class="prop" data-weight="Weight:">Weight</span
        ><span class="value" data-weight-value="">&nbsp;70</span>
      </p>
      <p>
        <span class="prop" data-gender="Gender:">Gender</span
        ><span class="value" data-gender-value="">&nbsp;F</span>
      </p>
      <p>
        <span class="prop" data-country="Country:">Country</span
        ><span class="value" data-country-value="">&nbsp;Rwanda</span>
      </p>
    </div>
    <button id="oracle" class="mdc-button">
      Calculate BMI
    </button>
    <div id="outcome">
      <h3 class="mdc-typography--headline5">BMI</h3>
      <p></p>
    </div>
    <script>
      const users = [];
      const countries = [
        'Chad',
        'Sierra Leone',
        'Mali',
        'Gambia',
        'Uganda',
        'Ghana',
        'Senegal',
        'Somalia',
        'Ivory Coast',
        'Isreal',
      ];

      const userList = document.querySelector('#select-text');
      const button = document.querySelector('#oracle');
      const displayUsers = (users) => {
        users.forEach((user) => {
          const optionElement = document.createElement('option');
          optionElement.textContent = `${user.name}`;
          optionElement.value = `${user.id}`;
          userList.appendChild(optionElement);
        });
      };
      const fetchAndDisplayUsers = () => {
        const api = 'https://randomapi.com/api/y1lfp11q?key=LEIX-GF3O-AG7I-6J84';
   		fetch(api).then(result => result.json()).then(({ results }) => {
          const [ user ] = results;
          users.push(user);
          displayUsers([user]);
        });
        users.push({
          age: 40,
          weight: 75,
          height: 6,
          country: 'Nigeria',
          name: 'Charles Odili',
          id: 'dfhb454768DghtF',
        });
        users.push({
          age: 23,
          weight: 70,
          height: 6.5,
          country: 'Rwanda',
          name: 'Ingabire Debolah',
          id: 'dm9dtaId',
        });
        displayUsers(users);
      };
      const getSelectedUser = (userId) =>
        users.find((user) => user.id === userId);

      const computeBMI = ({ weight, height, country }) => {
        const h = height * 0.3048;
        let bmi = weight / (h * h);
        for (let i = 0; i< countries.length; i++) {
          if ( countries[i].toLowerCase() === country.toLowerCase()) {
          	bmi = bmi * 0.82;
          }
        }
        return bmi.toFixed(1);
      };
      const letsCalculateBMI = () => {
        const userId = document.querySelector('#select-text').value;
        const bmiResult = document.querySelector('#outcome>p');
        const user = getSelectedUser(userId);
        const bmi = computeBMI(user);
        bmiResult.textContent = `${bmi}`;
      };

      const displaySelectedUser = ({ target }) => {
        const user = getSelectedUser(target.value);
        const properties = Object.keys(user);
        properties.forEach((property) => {
          const span = document.querySelector(
            `.value[data-${property}-value=""]`
          );
          if (span) {
            span.textContent = ` : ${user[property]}`;
          }
        });
      };
      const powerupTheUI = () => {
        button.addEventListener('click', letsCalculateBMI);
        userList.addEventListener('change', displaySelectedUser);
      };
      const startApp = () => {
        powerupTheUI();
        fetchAndDisplayUsers();
      };
      startApp();
    </script>
  </body>
</html>
