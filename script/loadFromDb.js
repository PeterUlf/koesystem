//const dbUrl = "Your url";
//const apikey = "Your apikey";

let problems = [];
fetch(dbUrl, {
  method: "get",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "x-apikey": apikey,
    "cache-control": "no-cache"
  }
})
  .then(e => e.json())
  .then(e => {
    problems = e;
    showContent();

    console.table(problems);
  });

function deleteRow() {
  console.log("deleteRow");
  document.querySelector("#popupScreen").classList.add("hide");
  document.querySelector("#delete").classList.add("hide");
  //document.querySelector(`.id_${id}`).remove();
  document
    .querySelectorAll("tbody > tr:nth-child(n+2)")
    .forEach(e => e.remove());
  document
    .querySelectorAll("#selections option:nth-child(n+2)")
    .forEach(e => e.remove());
}

function sbListChosen() {
  console.log("sbListChosen");
  let chosen = problems.filter(problem => problem._id === this.value);
  console.log("chosen", chosen);

  document.querySelector("#delete  [name=name]").value =
    chosen[0].problem_owner;
  document.querySelector("#delete  [name=problem_short]").value =
    chosen[0].problem_short;
  document.querySelector("#delete  [data-content=problem_long]").textContent =
    chosen[0].problem_long;

  //NB husk hvilken der er valgt, så den bliver slettet fra listen når der trykkes på updater problem
}

function showContent() {
  console.log("showContent");
  // document.querySelector("#popupScreen").classList.add("hide");
  // document.querySelector("#delete").classList.add("hide");
  let template = document.querySelector("#question");
  let template2 = document.querySelector("#solved_by");

  //question list
  let qList = document.querySelector("tbody");
  //solvedby list
  let sbList = document.querySelector("#selections");

  // Loop

  problems.forEach((el, i) => {
    // console.log("i er ", i);
    let clone = template.content.cloneNode(true);
    let clone2 = template2.content.cloneNode(true);

    clone.querySelector("[data-content=name]").textContent = el.problem_owner;
    clone.querySelector(
      "[data-content=problem_short]"
    ).innerHTML = `<strong>${el.problem_short}</strong><br> ${el.problem_long} `;
    clone.querySelector("[data-content=timeInQue]").textContent = el.time_added;
    clone.querySelector("[data-content=id]").classList = "id_" + el._id;

    clone
      .querySelector("[data-content=deleteList]")
      .addEventListener("click", deleteFromQueDialog);

    clone2.querySelector("option").textContent =
      el.problem_owner + ": " + el.problem_short;
    clone2.querySelector("option").value = el._id;

    sbList.addEventListener("change", sbListChosen);

    //clone.querySelector("li").addEventListener("click", clickStudent);
    qList.appendChild(clone);
    sbList.appendChild(clone2);

    function deleteFromQueDialog() {
      console.log("deleteFromQueDialog");
      document.querySelector("#popupScreen").classList.remove("hide");
      document.querySelector("#delete").classList.remove("hide");
      document
        .querySelector("#removeProblem")
        .addEventListener("click", deleteFromQue);
      document
        .querySelector("#updateProblem")
        .addEventListener("click", updateProblem);
    }

    function updateProblem() {
      document
        .querySelector("#updateProblem")
        .removeEventListener("click", updateProblem);
      console.log("updateProblem");
      let id = this;
      console.log(this.classList);
      let problem_owner = document.querySelector("#delete  [name=name]").value;
      console.log("problem_owner", problem_owner);
      let problem_short = document.querySelector(
        "#delete  [name=problem_short]"
      ).value;
      console.log("problem_short", problem_short);
      let problem_long = document.querySelector(
        "#delete  [data-content=problem_long]"
      ).textContent;
      console.log("problem_long", problem_long);
      console.log("problem_id", el._id);

      fetch(dbUrl + "/" + el._id, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json; charset=utf-8",
          // "Access- Control - Allow - Origin": "*",
          // "Content-Type": "application/json",

          "x-apikey": apikey,
          "cache-control": "no-cache"
        },
        //body: { "problem_owner": problem_owner , "problem_short": problem_short, "problem_long":problem_long},
        body: JSON.stringify({
          problem_owner: problem_owner,
          problem_short: problem_short,
          problem_long: problem_long
        }),
        json: true
      })
        .then(e => e.json())
        .then(e => {
          problems = e;
          //TODO: her er problems nok ikke et array, men bare et enkelt objekt :-)
          console.log("here kommes problems2");
          console.table(problems);
          showContent();
        });
    }

    function deleteFromQue() {
      console.log("deleteFromQue", el._id);
      document
        .querySelector("#removeProblem")
        .removeEventListener("click", deleteFromQue);

      fetch(dbUrl + "/" + el._id, {
        method: "delete",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-apikey": apikey,
          "cache-control": "no-cache"
        }
      }).then(e => {
        deleteRow(el._id);
        updateProblems();
      });
      function updateProblems() {
        //UPDATE PROBLEMS
        fetch(dbUrl, {
          method: "get",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": apikey,
            "cache-control": "no-cache"
          }
        })
          .then(e => e.json())
          .then(e => {
            problems = e;

            console.log("here kommes problems");
            console.table(problems);
            showContent();
          });
      }
    }
  });
}

function test() {
  fetch(dbUrl, {
    method: "POST",

    headers: {
      "Content-Type": "application/json; charset=utf-8",

      "x-apikey": apikey,
      "cache-control": "no-cache"
    },
    body: { problem_owner: "Peter Ulf" },
    json: true
  })
    .then(e => e.json())
    .then(e => {
      problems = e;

      console.log("here kommes problems2");
      console.table(problems);
      showContent();
    });
}
