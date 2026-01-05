const express = require('express');
const router = express.Router();

// Predefined Meal Plans
const MEAL_PLANS = {
    weight_loss: {
        title: "Weight Loss Plan (Low Carb, High Protein)",
        calories: "~1500-1800 kcal",
        breakfast: "Oatmeal with berries and a scoop of protein powder (or 2 boiled eggs). Green Tea.",
        lunch: "Grilled chicken breast (or Tofu) with mixed salad (cucumber, tomato, lettuce). Lemon dressing.",
        dinner: "Steamed fish (or Lentil Soup/Dal) with a small portion of brown rice and steamed broccoli."
    },
    weight_gain: {
        title: "Weight Gain Plan (High Calorie, High Protein)",
        calories: "~2500-3000 kcal",
        breakfast: "3 Whole Eggs omelet with cheese, 2 slices of whole wheat toast, and a banana milkshake.",
        lunch: "Large portion of Rice with Chicken Curry (or Paneer Butter Masala), yogurt, and mixed vegetables.",
        dinner: "Pasta with meat sauce (or heavy Dal Fry with Rice), sweet potato, and a glass of warm milk."
    },
    maintenance: {
        title: "Balanced Healthy Living Plan",
        calories: "~2000-2200 kcal",
        breakfast: "Whole grain toast with avocado (or peanut butter). Fresh orange juice.",
        lunch: "Sandwich with turkey/chicken (or Hummus & Veggie wrap) and a side of fruit.",
        dinner: "Grilled Salmon (or Stir-fried Tofu) with Quinoa and roasted asparagus."
    }
};

router.post('/', (req, res) => {
    try {
        const { height, weight, gender, goal } = req.body;

        if (!height || !weight || !goal) {
            return res.status(400).json({ message: "Please provide height, weight, and goal." });
        }

        // 1. Calculate BMI
        // BMI = weight (kg) / (height (m) * height (m))
        const heightM = height / 100;
        const bmi = (weight / (heightM * heightM)).toFixed(1);

        // 2. Determine BMI Status
        let status = "Healthy";
        if (bmi < 18.5) status = "Underweight";
        else if (bmi >= 25 && bmi < 29.9) status = "Overweight";
        else if (bmi >= 30) status = "Obese";

        // 3. Select Plan
        // Map user goal string to our keys
        let planKey = "maintenance";
        if (goal.toLowerCase().includes("loss")) planKey = "weight_loss";
        else if (goal.toLowerCase().includes("gain")) planKey = "weight_gain";

        const plan = MEAL_PLANS[planKey];

        // 4. Return Response
        res.json({
            bmi: bmi,
            status: status,
            plan: plan
        });

    } catch (error) {
        console.error("Diet Error:", error);
        res.status(500).json({ message: "Failed to generate plan." });
    }
});

module.exports = router;
