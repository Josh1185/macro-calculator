// Create functions to clean up input
// Will remove any '+', '-', and whitespace from input
function cleanInput(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}
// Will return an error if user enters and scientific notation value
function checkInputError(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

// Access elements using the DOM
const ageInput = document.getElementById('age-input');
const genderInput = document.getElementById('gender-input');

// Height comes in Feet and Inches
const heightInputFeet = document.getElementById('height-feet');
const heightInputInches = document.getElementById('height-inches');

const weightInput = document.getElementById('weight-input');
const activityLevelInput = document.getElementById('activity-level-input');
const goalInput = document.getElementById('goal-input');

// Button element and output elements
const calcBtn = document.getElementById('submit-btn');
const calorieOutput = document.getElementById('calorie-output');
const carbOutput = document.getElementById('carb-output');
const proteinOutput = document.getElementById('protein-output');
const fatOutput = document.getElementById('fat-output');

// Element for hiding output screen
const outputToggle = document.querySelector('.outputs-wrapper');
outputToggle.style.display = 'none';

// Handle all number inputs
let isError = false;

function handleNumbers(input) {
  if (checkInputError(cleanInput(input))) {
    isError = true;
    alert(`Invalid Input: ${cleanInput(input)}`);
    return;
  }

  return parseInt(cleanInput(input));
}

function render() {

  const age = handleNumbers(ageInput.value);
  const heightFeet = handleNumbers(heightInputFeet.value);
  const heightInches = handleNumbers(heightInputInches.value);
  const weightPounds = handleNumbers(weightInput.value);

  // Convert height to cm
  function convertHeight(heightFt, heightIn) {
    const totalHeightInches = (heightFt * 12) + heightIn;
    const heightCentimeters = (totalHeightInches * 2.54);

    return heightCentimeters;
  }
  const heightCentimeters = convertHeight(heightFeet, heightInches);

  // Convert weight to kg
  function convertWeight(weightLbs) {
    const weightKilograms = (weightLbs / 2.205);
    return weightKilograms;
  }
  const weightKilograms = convertWeight(weightPounds);

  // Use Mifflin-St Jeor Equation for the BMR
  function getBMR(gender) {
    // Check if the user is a male or female
    let isMale = false;
    let isFemale = false;

    if (gender === "male") {
      isMale = true;
    } else if (gender === "female") {
      isFemale = true;
    }

    let bmr = 0;

    if (isMale) {
      bmr = 10 * weightKilograms + 6.25 * heightCentimeters - 5 * age + 5;
    } else if (isFemale) {
      bmr = 10 * weightKilograms + 6.25 * heightCentimeters - 5 * age - 161;
    }

    return bmr;
  }
  const bmr = getBMR(genderInput.value);

  // Calculate TDEE (Total Daily Energy Expenditure)
  function getTDEE(activity) {
    let activityFactor;
    let tdee = 0;

    switch (activity) {
      case "sedentary":
        activityFactor = 1.2;
        break;
      case "lightly-active":
        activityFactor = 1.375;
        break;
      case "moderately-active":
        activityFactor = 1.55;
        break;
      case "very-active":
        activityFactor = 1.725;
        break;
      case "super-active":
        activityFactor = 1.9;
        break;
    }

    tdee = Math.round(bmr * activityFactor); // Total daily calories
    return tdee;
  }
  const tdee = getTDEE(activityLevelInput.value);

  function calculateMacros(goalInput) {
    // Macro ratios depending on goals
    let carbRatio;
    let proteinRatio;
    let fatRatio;

    switch (goalInput) {
      case "balanced":
        carbRatio = 0.40;
        proteinRatio = 0.30;
        fatRatio = 0.30;
        break;
      case "fat-loss":
        carbRatio = 0.35;
        proteinRatio = 0.45;
        fatRatio = 0.20;
        break;
      case "muscle-gain":
        carbRatio = 0.55;
        proteinRatio = 0.30;
        fatRatio = 0.15;
        break;
    }

    // Calculate Macros
    const carbCalories = tdee * carbRatio;
    const carbGrams = Math.round(carbCalories / 4);

    const proteinCalories = tdee * proteinRatio;
    const proteinGrams = Math.round(proteinCalories / 4);

    const fatCalories = tdee * fatRatio;
    const fatGrams = Math.round(fatCalories / 9);

    if (isError) {
      outputToggle.style.display = 'none';
      isError = false;
      return;
    }

    // Generate the output with the tdee and macros
    calorieOutput.innerHTML = `<strong>${tdee}</strong> calories`;
    carbOutput.innerHTML = `<strong>${carbGrams}</strong> grams of carbs`;
    proteinOutput.innerHTML = `<strong>${proteinGrams}</strong> grams of protein`;
    fatOutput.innerHTML = `<strong>${fatGrams}</strong> grams of fat`;

    outputToggle.style.display = 'flex';
  }
  
  calculateMacros(goalInput.value);
}

// Prevent default from submit action
const form = document.querySelector('.macro-calculator');
form.addEventListener('submit', (e) => {
  e.preventDefault();
})

// Render output if all fields are filled
calcBtn.addEventListener('click', () => {
  if (ageInput.value === '') {
    alert('Please fill in your age.');
    return;
  } else if (heightInputFeet.value === '') {
    alert('Please fill in your height (feet).');
    return;
  } else if (heightInputInches.value === '') {
    alert('Please fill in your height (inches).');
    return;
  } else if (weightInput.value === '') {
    alert('Please fill in your weight.');
    return;
  }
  // Make sure all inputs are in range
  else if (Number(ageInput.value) < 18 || Number(ageInput.value) > 80) {
    alert(`Age: ${ageInput.value} is out of bounds.`);
    return;
  } 
  else if (Number(heightInputFeet.value) > 8 || Number(heightInputFeet.value) < 4) {
    alert(`Height(feet): ${heightInputFeet.value} is out of bounds.`);
    return;
  } 
  else if (Number(heightInputInches.value) > 11 || Number(heightInputInches.value) < 0) {
    alert(`Height(inches): ${heightInputInches.value} is out of bounds.`);
    return;
  } 
  else if (Number(weightInput.value) > 600 || Number(weightInput.value) < 60) {
    alert(`Weight: ${weightInput.value} is out of bounds.`);
    return;
  }
  else {
    render();
  }
});

// Add an event listener to the back button
document.getElementById('back-btn')
  .addEventListener('click', () => {
    outputToggle.style.display = 'none';
  })