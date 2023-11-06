/*
--------------------------Known Bugs--------------------------
- Create a new user, then whern trying to edit or delete bugs 

--------------------------Causes--------------------------
- See function `getPersonnel()` the way the app is designed is the get encompasses everything inside the `renderPersonnel()` 
*/

// On document load
$(document).ready(() => {
  // remove preloader
  $("body div:first-child").removeAttr("id");

  // Prevent form resubmit //
  $("form").submit(() => {
    return false;
  });

  // Populate select fields
  populateFields("populateFields.php", ".department-select", "department");
  populateFields("populateFields.php", ".location-select", "location");

  // Get all Personnel
  renderPersonnel("");
});

// Action on user search
$("#searchButton").click(function () {
  $(".result").empty();
  const select = $("#searchOption").val();
  const value = $("#searchBox").val();

  $("#searchBox").val("");

  if (select === "personnel") {
    value !== "" ? renderPersonnel(value) : renderPersonnel("");
  } else if (select === "department") {
    value !== "" ? renderDepartments(value) : renderDepartments("");
  } else if (select === "location") {
    value !== "" ? renderLocations(value) : renderLocations("");
  }
});

// Category change
$("#searchOption").change(function () {
  const select = $(this).val();
  const addButton = $("#addButton");
  const searchField = $("#searchBox");

  if (select === "personnel") {
    // Clear result
    $(".result").empty();

    searchField.val("");

    $("#addButton").click(() => {
      $("#addUserModal").each(function () {
        $(this).find("input").val("");
      });
    });

    addButton.attr("data-target", "#addUserModal");

    renderPersonnel("");
  } else if (select === "department") {
    $(".result").empty();

    searchField.val("");

    $("#addButton").click(() => {
      $("#addDepartmentModal").each(function () {
        $(this).find("input").val("");
      });
    });

    addButton.attr("data-target", "#addDepartmentModal");

    renderDepartments("");
  } else if (select === "location") {
    $(".result").empty();

    searchField.val("");

    $("#addButton").click(() => {
      $("#addLocationModal").each(function () {
        $(this).find("input").val("");
      });
    });

    addButton.attr("data-target", "#addLocationModal");

    renderLocations("");
  }
});

// Blueprint for all ajax requests
function ajaxRequest(url, data, code) {
  $.ajax({
    url: url,
    type: `GET`,
    dataType: `json`,
    data: data,
    success: (result) => {
      code(result);
    },
    error: (xhr) => {
      // console.log(xhr["responseText"]);
    },
  });
}

// Message modal
function messageModal(title, message, type, hide) {
  $(hide).modal("hide");
  $("#messageModal h4").html(title);
  $("#messageModal p").html(message);
  $("#messageModal .modal-content").addClass(
    `alert alert-${type ? "success" : "danger"}`
  );
  $("#messageModal .modal-content").removeClass(
    `alert alert-${type ? "danger" : "success"}`
  );
  $("#messageModal").modal("show");
}

// Populate select fields
function populateFields(type, select, data) {
  $(select).empty();
  ajaxRequest(`./libs/php/${type}`, { type: data }, (result) => {
    result["data"].forEach((el) => {
      $(select).append(new Option(el["name"], el["id"]));
    });
  });
}

function getPersonnel(value) {
  ajaxRequest(
    "./libs/php/get.php",
    {
      value: value,
      type: "personnel",
    },
    (result) => {
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
            <div class="card col">
              <div class="card-body ">
                <h5 class="card-title">${el["firstName"]} ${el["lastName"]}</h5>
                <h6 class="card-subtitle text-muted mb-1">${el["location"]}</h6>
                <p class="card-text mb-1">${el["department"]}</p>
                <a href="#" class="card-link ">${el["email"]}</a>
                <div class="input-group w-50 mt-1">
                  <button class="btn btn-success btn-sm  mr-1 input-group-text edit" data-toggle="modal" data-target="#editUserModal" data-id=${el["id"]}>
                    <img src="./assets/Images/edit.svg" alt="edit button" />
                  </button>
                  <button class="btn btn-danger btn-sm input-group-text delete" data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                    <img src="./assets/Images/delete.svg" alt="delete button" />
                  </button>
                </div>
              </div>
            </div>
          `);
        });
      } else {
        messageModal(
          `User not found!`,
          `Could not find <b>${value}</b>, please try again.`,
          false
        );
      }
    }
  );
}

function getDepartment(value) {
  ajaxRequest(
    "./libs/php/get.php",
    {
      value: value,
      type: "department",
    },
    (result) => {
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
            <div class="card col">
              <div class="card-body ">
                  <p class="card-text">${el["name"]} </p>
                  <div class="input-group w-50 mt-1">
                    <button class="btn btn-success btn-sm input-group-text mr-1 edit " data-toggle="modal" data-target="#editDepModal" data-id=${el["id"]}>
                      <img src="./assets/Images/edit.svg" alt="edit button" />
                    </button>
                    <button class="btn btn-danger btn-sm input-group-text delete" data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                      <img src="./assets/Images/delete.svg" alt="delete button" />
                    </button>
                  </div>
              </div>
            </div>
        `);
        });
      } else {
        messageModal(
          `Department not found!`,
          `Could not find <b>${value}</b>, please try again.`,
          false
        );
      }
    }
  );
}

function getLocation(value) {
  ajaxRequest(
    "./libs/php/get.php",
    {
      value: value,
      type: "location",
    },
    (result) => {
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
            <div class="card col">
              <div class="card-body ">
                  <p class="card-text">${el["name"]} </p>
                  <div class="input-group w-50 mt-1">
                    <button class="btn btn-success btn-sm input-group-text mr-1 edit" data-toggle="modal" data-target="#editLocModal" data-id=${el["id"]}>
                      <img src="./assets/Images/edit.svg" alt="edit button" />
                    </button>
                    <button class="btn btn-danger btn-sm input-group-text delete " data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                      <img src="./assets/Images/delete.svg" alt="delete button" />
                    </button>
                  </div>
              </div>
            </div>
        `);
        });
      } else {
        messageModal(
          `Location not found!`,
          `Could not find <b>${value}</b>, please try again.`,
          false
        );
      }
    }
  );
}

// Get, Edit, Delete, Add Personnel
function renderPersonnel(value) {
  ajaxRequest(
    "./libs/php/get.php",
    {
      value: value,
      type: "personnel",
    },
    (result) => {
      // Clear prev result
      $(".result").empty();

      // Get
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
            <div class="card col">
              <div class="card-body ">
                <h5 class="card-title">${el["firstName"]} ${el["lastName"]}</h5>
                <h6 class="card-subtitle text-muted mb-1">${el["location"]}</h6>
                <p class="card-text mb-1">${el["department"]}</p>
                <a href="#" class="card-link ">${el["email"]}</a>

                <div class="input-group w-50 mt-1">
                  <button class="btn btn-success btn-sm  mr-1 input-group-text edit" data-toggle="modal" data-target="#editUserModal" data-id=${el["id"]}>
                    <img src="./assets/Images/edit.svg" alt="edit button" />
                  </button>
                  <button class="btn btn-danger btn-sm input-group-text delete" data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                    <img src="./assets/Images/delete.svg" alt="delete button" />
                  </button>
                </div>
              </div>
            </div>
          `);
        });
      } else {
        messageModal(
          `User not found!`,
          `Could not find <b>${value}</b>, please try again.`,
          false
        );
      }

      // Edit
      $(".edit").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "personnel",
          },
          (result) => {
            const firstNameDom = $("#editUserModal").find("#editFirstName");
            const lastNameDom = $("#editUserModal").find("#editLastName");
            const emailDom = $("#editUserModal").find("#editEmail");
            const departmentDom =
              $("#editUserModal").find(".department-select");
            const firstName = result["data"]["firstName"];
            const lastName = result["data"]["lastName"];

            firstNameDom.val(firstName);
            lastNameDom.val(lastName);
            emailDom.val(result["data"]["email"]);
            departmentDom.val(result["data"]["departmentID"]);

            $(".editButton")
              .unbind()
              .click(() => {
                const newFirstName = firstNameDom.val();
                const newLastName = lastNameDom.val();
                const newEmail = emailDom.val();
                const newDepartment = departmentDom.val();

                ajaxRequest(
                  "./libs/php/edit.php",
                  {
                    id: id,
                    type: "personnel",
                    newFirstName: newFirstName,
                    newLastName: newLastName,
                    newEmail: newEmail,
                    newDepartment: newDepartment,
                  },
                  (result) => {
                    if (result["data"]) {
                      messageModal(
                        `User edited successfully!`,
                        `User's <b>${firstName} ${lastName}</b> details sucessfully changed.`,
                        true,
                        "#editUserModal"
                      );
                      $(".result").empty();

                      getPersonnel(newFirstName);
                    } else {
                      messageModal(
                        `Error!`,
                        `User's <b>${firstName} ${lastName}</b> details could not be changed.`,
                        false,
                        "#editUserModal"
                      );
                    }
                  }
                );
              });
          }
        );
      });

      // Delete
      $(".delete").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "personnel",
          },
          (result) => {
            const firstName = result["data"]["firstName"];
            const lastName = result["data"]["lastName"];

            $(".yesDelete")
              .unbind() // make sure click event only runs once
              .click(() => {
                ajaxRequest(
                  "./libs/php/delete.php",
                  {
                    id: id,
                    type: "personnel",
                  },
                  () => {
                    messageModal(
                      `Success!`,
                      `User's <b>${firstName} ${lastName}</b> details sucessfully deleted.`,
                      true,
                      "#deleteModal"
                    );
                    $(this).parent().parent().remove();
                  }
                );
              });
          }
        );
      });
    }
  );

  // Add
  $("#addUser")
    .unbind()
    .click(function () {
      const firstName = $("#firstName").val();
      const lastName = $("#lastName").val();
      const email = $("#email").val();
      const department = $(".department-select").val();

      ajaxRequest(
        "./libs/php/add.php",
        {
          type: "personnel",
          firstName: firstName,
          lastName: lastName,
          email: email,
          department: department,
        },
        (result) => {
          if (result["data"]) {
            messageModal(
              `User added!`,
              `User <b>${firstName} ${lastName}</b> sucessfully added!`,
              true,
              "#addUserModal"
            );
            $(".result").empty();

            getPersonnel(firstName);
          } else {
            messageModal(
              `Error!`,
              `User <b>${firstName} ${lastName}</b> cannot be added!`,
              false,
              "#addUserModal"
            );
          }
        }
      );
    });
}

function renderDepartments(value) {
  ajaxRequest(
    "./libs/php/get.php",
    {
      value: value,
      type: "department",
    },
    (result) => {
      // *Clear prev result
      $(".result").empty();

      // *Get
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
            <div class="card col">
              <div class="card-body ">
                  <p class="card-text">${el["name"]} </p>
                  <div class="input-group w-50 mt-1">
                    <button class="btn btn-success btn-sm input-group-text mr-1 edit " data-toggle="modal" data-target="#editDepModal" data-id=${el["id"]}>
                      <img src="./assets/Images/edit.svg" alt="edit button" />
                    </button>
                    <button class="btn btn-danger btn-sm input-group-text delete" data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                      <img src="./assets/Images/delete.svg" alt="delete button" />
                    </button>
                  </div>
              </div>
            </div>
        `);
        });
      } else {
        messageModal(
          `Department not found!`,
          `Could not find <b>${value}</b>, please try again.`,
          false
        );
      }

      // *Edit
      $(".edit").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "department",
          },
          (result) => {
            const departmentDom = $("#editDepModal").find(
              "#editDepartmentName"
            );
            const locationDom = $("#editDepModal").find(
              "#editLocationOfDepartment"
            );
            const department = result["data"]["name"];

            departmentDom.val(department);
            locationDom.val(result["data"]["locationID"]);

            $(".editButton")
              .unbind()
              .click(() => {
                const newDepartment = departmentDom.val();
                const newLocation = locationDom.val();

                ajaxRequest(
                  "./libs/php/edit.php",
                  {
                    id: id,
                    type: "department",
                    newDepartment: newDepartment,
                    newLocation: newLocation,
                  },
                  (result) => {
                    if (result["data"]) {
                      messageModal(
                        `Department edited successfully!`,
                        `Department's <b>${department}</b> details sucessfully changed.`,
                        true,
                        "#editDepModal"
                      );

                      $(".result").empty();

                      getDepartment(newDepartment);
                    } else {
                      messageModal(
                        `Error!`,
                        `Department's <b>${department}</b> details could not be changed.`,
                        false,
                        "#editDepModal"
                      );
                    }
                  }
                );
              });
          }
        );
      });

      // *Delete
      $(".delete").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "department",
          },
          (result) => {
            const department = result["data"]["name"];

            ajaxRequest(
              "./libs/php/checkNumber.php",
              {
                id: id,
                type: "department",
              },
              (result) => {
                if (result["data"]["pc"] === "0") {
                  $(".yesDelete")
                    .unbind()
                    .click(() => {
                      ajaxRequest(
                        "./libs/php/delete.php",
                        {
                          id: id,
                          type: "department",
                        },
                        () => {
                          messageModal(
                            `Success!`,
                            `Department's <b>${department}</b> details sucessfully deleted.`,
                            true,
                            "#deleteModal"
                          );

                          $(this).parent().parent().remove();
                        }
                      );
                    });
                } else {
                  messageModal(
                    `Error!`,
                    `Cannot delete <b>${department}</b> please remove the remaining <b>${result["data"]["pc"]}</b> users first.`,
                    false,
                    "#deleteModal"
                  );
                }
              }
            );
          }
        );
      });
    }
  );

  // *Add
  $("#addDepartment")
    .unbind()
    .click(function () {
      const locationID = $("#locationOfDepartment").val();
      const department = $("#departmentName").val();

      ajaxRequest(
        "./libs/php/add.php",
        {
          type: "department",
          department: department,
          locationID: locationID,
        },
        (result) => {
          if (result["data"]) {
            messageModal(
              `Department added!`,
              `Department <b>${department}</b> sucessfully added!`,
              true,
              "#addDepartmentModal"
            );
            $(".result").empty();

            getDepartment(department);
          } else {
            messageModal(
              `Error!`,
              `Department <b>${department}</b> cannot be added!`,
              false,
              "#addDepartmentModal"
            );
          }
        }
      );
    });
}

function renderLocations(value) {
  ajaxRequest(
    "./libs/php/get.php",
    {
      value: value,
      type: "location",
    },
    (result) => {
      // *Clear prev result
      $(".result").empty();

      // *Get
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
            <div class="card col">
              <div class="card-body ">
                  <p class="card-text">${el["name"]} </p>
                  <div class="input-group w-50 mt-1">
                    <button class="btn btn-success btn-sm input-group-text mr-1 edit" data-toggle="modal" data-target="#editLocModal" data-id=${el["id"]}>
                      <img src="./assets/Images/edit.svg" alt="edit button" />
                    </button>
                    <button class="btn btn-danger btn-sm input-group-text delete " data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                      <img src="./assets/Images/delete.svg" alt="delete button" />
                    </button>
                  </div>
              </div>
            </div>
        `);
        });
      } else {
        messageModal(
          `Location not found!`,
          `Could not find <b>${value}</b>, please try again.`,
          false
        );
      }

      // *Edit
      $(".edit").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "location",
          },
          (result) => {
            const locationDom = $("#editLocModal").find("#editLocationName");
            const location = result["data"]["name"];

            locationDom.val(location);

            $(".editButton")
              .unbind()
              .click(() => {
                const newLocation = locationDom.val();

                ajaxRequest(
                  "./libs/php/edit.php",
                  {
                    id: id,
                    type: "location",
                    newLocation: newLocation,
                  },
                  (result) => {
                    if (result["data"]) {
                      messageModal(
                        `Location edited successfully!`,
                        `Location's <b>${location}</b> details sucessfully changed.`,
                        true,
                        "#editLocModal"
                      );

                      $(".result").empty();

                      getLocation(newLocation);
                    } else {
                      messageModal(
                        `Error!`,
                        `Location's <b>${location}</b> details could not be changed.`,
                        false,
                        "#editLocModal"
                      );
                    }
                  }
                );
              });
          }
        );
      });

      // *Delete
      $(".delete").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "location",
          },
          (result) => {
            const location = result["data"]["name"];

            ajaxRequest(
              "./libs/php/checkNumber.php",
              {
                id: id,
                type: "location",
              },
              (result) => {
                if (result["data"]["dc"] === "0") {
                  $(".yesDelete")
                    .unbind()
                    .click(() => {
                      ajaxRequest(
                        "./libs/php/delete.php",
                        {
                          id: id,
                          type: "location",
                        },
                        () => {
                          messageModal(
                            `Success!`,
                            `Location's <b>${location}</b> details sucessfully deleted.`,
                            true,
                            "#deleteModal"
                          );

                          $(this).parent().parent().remove();
                        }
                      );
                    });
                } else {
                  messageModal(
                    `Error!`,
                    `Cannot delete <b>${location}</b> please remove the remaining <b>${result["data"]["dc"]}</b> departments first.`,
                    false,
                    "#deleteModal"
                  );
                }
              }
            );
          }
        );
      });
    }
  );
  // *Add
  $("#addLocation")
    .unbind()
    .click(function () {
      const location = $("#locationName").val();

      ajaxRequest(
        "./libs/php/add.php",
        {
          type: "location",
          location: location,
        },
        (result) => {
          if (result["data"]) {
            messageModal(
              `Location added!`,
              `Location <b>${location}</b> sucessfully added!`,
              true,
              "#addLocationModal"
            );

            $(".result").empty();

            getLocation(location);
          } else {
            messageModal(
              `Error!`,
              `Location <b>${location}</b> cannot be added!`,
              false,
              "#addLocationModal"
            );
          }
        }
      );
    });
}
