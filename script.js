const sidebarSteps = document.querySelectorAll(".sidebar-step");
const steps = document.querySelectorAll(".step");
const forms = document.querySelectorAll("form");
const plans = forms[1].querySelectorAll("input[type=radio]");
const planItems = forms[1].querySelectorAll("label");
const errLabel = document.querySelector(".input-group p");

const switchPlan = document.querySelector(".switch-plan");
const switchPlanLabel = document.querySelector(".switch-plan");

const addOnsLabels = document.querySelectorAll(".step-3 form label");
const addOnsContainer = document.querySelector(".add-ons");

const summary = document.querySelector(".subscription .plan");

const monthlyPlan = [9, 12, 15];
const yearlyPlan = [90, 120, 150];

const monthlyAddOns = [1, 2, 2];
const yearlyAddOns = [10, 20, 20];

let currentStep = 0;
let currentCircle = 0;
let total = 0;
let obj = { name: "", price: 0, type: "Monthly" };

// Initail
changePlan("monthly");
updateAddOns();

// Next and Prev Buttons
steps.forEach((step) => {
  const nextBtn = step.querySelector(".next-step");
  const prevBtn = step.querySelector(".prev-step");
  console.log(nextBtn);
  console.log(prevBtn);
  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(selectPlanRequired(forms[1]));
      if (
        (currentStep === 0 && validateForm(forms[0])) ||
        (currentStep === 1 && selectPlanRequired(forms[1])) ||
        (currentStep > 1 && currentStep < 5)
      ) {
        steps[currentStep].style.display = "none";
        currentStep++;
        currentCircle++;
        steps[currentStep].style.display = "flex";
        sidebarSteps[currentCircle].classList.add("active");
      }
      console.log(steps[currentStep]);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      steps[currentStep].style.display = "none";
      currentStep--;
      sidebarSteps[currentCircle].classList.remove("active");
      currentCircle--;
      steps[currentStep].style.display = "flex";
    });
  }
});

function selectPlanRequired(form) {
  let valid = false;
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.checked) {
      valid = true;
    }
  });
  return valid;
}

// Validate form 1
function validateForm(form) {
  let valid = false;
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    if (!input.value) {
      const label = getLabel(input);
      if (label) {
        label.style.display = "block";
        input.classList.add("err");
        valid = false;
      }
    } else {
      const label = getLabel(input);
      if (label) {
        label.style.display = "none";
        input.classList.remove("err");
        valid = true;
      }
    }
  });
  return valid;
}

// get sibling label
function getLabel(input) {
  const id = input.id;
  const label = document.querySelector(`label[for=${id}] ~ p`);
  return label;
}

function updateAddOns(type = "monthly") {
  if (type == "monthly") {
    addOnsLabels.forEach((addOn, i) => {
      const price = addOn.querySelector(".price");
      console.log(price);
      price.innerHTML = `+$${monthlyAddOns[i]}/mo`;
    });
  } else {
    addOnsLabels.forEach((addOn, i) => {
      const price = addOn.querySelector(".price");
      price.innerHTML = `+$${yearlyAddOns[i]}/yr`;
    });
  }
}

// Switch plan type button
switchPlanLabel.addEventListener("click", function () {
  if (switchPlan.querySelector("input:checked")) {
    switchPlan.querySelector(".yearly").classList.add("active");
    switchPlan.querySelector(".monthly").classList.remove("active");
    changePlan("yearly");
    obj.type = "Yearly";
    updateSelectedPlan(forms[1]);
    updateAddOns((type = "yearly"));
  } else {
    switchPlan.querySelector(".monthly").classList.add("active");
    switchPlan.querySelector(".yearly").classList.remove("active");
    changePlan("monthly");
    obj.type = "Monthly";
    updateSelectedPlan(forms[1]);
    updateAddOns((type = "monthly"));
  }
});

// Plan Items
function changePlan(currentPlan) {
  planItems.forEach((plan, i) => {
    if (currentPlan == "monthly") {
      plan.querySelector(".price").innerHTML = `$${monthlyPlan[i]}/mo`;
      plan.querySelector(".offer").style.display = "none";
    } else {
      plan.querySelector(".price").innerHTML = `$${yearlyPlan[i]}/yr`;
      plan.querySelector(".offer").style.display = "block";
    }
  });
}

// get selected plan
plans.forEach((plan) => {
  plan.addEventListener("click", function () {
    updateSelectedPlan(forms[1]);
    summaryTotal();
  });
});

function updateSelectedPlan(form) {
  const selected = form.querySelector("input[type=radio]:checked");
  const infoSelected = selected.nextElementSibling;
  const title = infoSelected.querySelector("h3").innerHTML;
  const price = infoSelected.querySelector(".price").innerHTML;
  obj.name = title;
  obj.price = price;

  total += parseInt(obj.price.match(/\d+/)[0]);
}

addOnsLabels.forEach((addOn) => {
  addOn.addEventListener("click", function (e) {
    const selected = addOn.querySelector("input[type=checkbox]");
    let price = addOn.querySelector(".price").innerHTML;
    console.log(price);
    console.log(price.match(/\d+/)[0]);

    if (selected.checked) {
      selected.checked = false;
      handleAddOnClick(addOn, true, selected.id);
      total -= parseInt(price.match(/\d+/)[0]);
      e.preventDefault();
    } else {
      selected.checked = true;
      handleAddOnClick(addOn, false, selected.id);
      total += parseInt(price.match(/\d+/)[0]);
      e.preventDefault();
    }

    const totalPriceElemet = document.querySelector(".total .strong-price");
    const totalTypeElemet = document.querySelector(".total p");
    totalPriceElemet.innerHTML = `$${total}`;
    totalTypeElemet.innerHTML = `Total (${obj.type})`;
  });
});

function handleAddOnClick(addOn, remove, id) {
  const selected = addOn.querySelectorAll("input[type=checkbox]");

  selected.forEach((item) => {
    if (remove && id === item.id) {
      addOnsContainer.querySelector(`#${id}`).remove();
    } else {
      const infoSelected = item.nextElementSibling;
      const title = infoSelected.querySelector("h3").innerHTML;
      const price = infoSelected.nextElementSibling.innerHTML;
      addOnsContainer.appendChild(addOnToHtml(title, price, id));
    }
  });
  summaryTotal();
}

function addOnToHtml(title, price, id) {
  let el = document.createElement("div");
  el.classList.add("add-on");
  el.setAttribute("id", id);
  const content = `
  <p class="add-on-name">${title}</p>
  <span class="price">${price}</span>
  `;
  el.innerHTML = content;
  return el;
}

function summaryTotal() {
  const planName = summary.querySelector(".plan-name");
  const price = summary.querySelector(".price");

  planName.innerHTML = `${obj.name} (${obj.type})`;
  price.innerHTML = obj.price;
}
