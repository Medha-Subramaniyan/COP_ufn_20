# Meal Tracking System Documentation

## Overview

The meal tracking system organizes food entries into four categories:
- **breakfast** - Morning meals
- **lunch** - Midday meals  
- **dinner** - Evening meals
- **snack** - Snacks between meals

## Database Schema

### Food Model
```javascript
{
  user: ObjectId,           // Reference to User
  foodName: String,         // Name of the food
  calories: Number,         // Calories per serving
  protein: Number,          // Protein in grams
  carbs: Number,            // Carbohydrates in grams
  fats: Number,             // Fats in grams
  portionSize: String,      // Description of portion size
  mealTime: String,         // breakfast, lunch, dinner, snack
  date: Date,               // When the food was consumed
  createdAt: Date           // When the record was created
}
```

## API Endpoints

### 1. Add Food Entry with Meal Time

**POST** `/api/food`

**Request Body:**
```json
{
  "userId": "user_id_here",
  "foodName": "Grilled Chicken Breast",
  "calories": 165,
  "protein": 31,
  "carbs": 0,
  "fats": 3.6,
  "portionSize": "1 breast (174g)",
  "mealTime": "lunch",
  "date": "2024-01-15T12:00:00Z"
}
```

**Response:**
```json
{
  "id": "food_entry_id",
  "error": ""
}
```

### 2. Get Foods by Meal Type

**GET** `/api/food/:userId/meal/:mealTime`

**Query Parameters:**
- `date`  - Filter by specific date (YYYY-MM-DD format)

**Examples:**
- `GET /api/food/123/meal/breakfast` - All breakfast foods for user
- `GET /api/food/123/meal/lunch?date=2024-01-15` - Lunch foods for specific date

**Response:**
```json
{
  "foods": [
    {
      "_id": "food_id",
      "foodName": "Greek Yogurt",
      "calories": 130,
      "protein": 22,
      "carbs": 9,
      "fats": 0.5,
      "portionSize": "1 cup",
      "mealTime": "breakfast",
      "date": "2024-01-15T08:00:00Z"
    }
  ],
  "mealTime": "breakfast",
  "error": ""
}
```

### 3. Get Daily Meal Summary

**GET** `/api/food/:userId/daily-summary`

**Query Parameters:**
- `date`  - Specific date (YYYY-MM-DD format), defaults to today

**Example:**
`GET /api/food/123/daily-summary?date=2024-01-15`

**Response:**
```json
{
  "date": "2024-01-15",
  "meals": {
    "breakfast": [
      {
        "foodName": "Greek Yogurt",
        "calories": 130,
        "protein": 22,
        "carbs": 9,
        "fats": 0.5,
        "mealTime": "breakfast"
      }
    ],
    "lunch": [
      {
        "foodName": "Grilled Chicken Breast",
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fats": 3.6,
        "mealTime": "lunch"
      }
    ],
    "dinner": [],
    "snack": []
  },
  "totals": {
    "calories": 295,
    "protein": 53,
    "carbs": 9,
    "fats": 4.1
  },
  "error": ""
}
```

## Frontend Integration Examples

### Adding a Meal Entry

```javascript
const addMealEntry = async (userId, mealData) => {
  try {
    const response = await fetch('/api/food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...mealData,
        date: new Date().toISOString()
      })
    });
    
    const result = await response.json();
    if (result.error) {
      throw new Error(result.error);
    }
    
    return result;
  } catch (error) {
    console.error('Error adding meal:', error);
    throw error;
  }
};

// Usage
await addMealEntry('user123', {
  foodName: 'Oatmeal',
  calories: 154,
  protein: 5.3,
  carbs: 28,
  fats: 3.2,
  portionSize: '1 cup cooked',
  mealTime: 'breakfast'
});
```

### Getting Daily Summary

```javascript
const getDailySummary = async (userId, date = null) => {
  try {
    const dateParam = date ? `?date=${date}` : '';
    const response = await fetch(`/api/food/${userId}/daily-summary${dateParam}`);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    throw error;
  }
};

// Usage
const todaysSummary = await getDailySummary('user123');
const specificDay = await getDailySummary('user123', '2024-01-15');
```

### Getting Specific Meal

```javascript
const getMealFoods = async (userId, mealTime, date = null) => {
  try {
    const dateParam = date ? `?date=${date}` : '';
    const response = await fetch(`/api/food/${userId}/meal/${mealTime}${dateParam}`);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching meal foods:', error);
    throw error;
  }
};

// Usage
const breakfastFoods = await getMealFoods('user123', 'breakfast');
const lunchToday = await getMealFoods('user123', 'lunch', '2024-01-15');
```

## React Component Examples

### Meal Selector Component

```jsx
import React, { useState } from 'react';

const MealSelector = ({ value, onChange }) => {
  const mealOptions = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
  ];

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {mealOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default MealSelector;
```

### Daily Summary Component

```jsx
import React, { useState, useEffect } from 'react';

const DailySummary = ({ userId, date }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const dateParam = date ? `?date=${date}` : '';
        const response = await fetch(`/api/food/${userId}/daily-summary${dateParam}`);
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [userId, date]);

  if (loading) return <div>Loading...</div>;
  if (!summary) return <div>No data available</div>;

  return (
    <div className="daily-summary">
      <h2>Daily Summary - {summary.date}</h2>
      
      <div className="totals">
        <h3>Daily Totals</h3>
        <p>Calories: {summary.totals.calories}</p>
        <p>Protein: {summary.totals.protein}g</p>
        <p>Carbs: {summary.totals.carbs}g</p>
        <p>Fats: {summary.totals.fats}g</p>
      </div>

      {Object.entries(summary.meals).map(([mealTime, foods]) => (
        <div key={mealTime} className="meal-section">
          <h3>{mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}</h3>
          {foods.length > 0 ? (
            <ul>
              {foods.map((food, index) => (
                <li key={index}>
                  {food.foodName} - {food.calories} cal
                </li>
              ))}
            </ul>
          ) : (
            <p>No foods logged for this meal</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DailySummary;
```

## Sample Data

The seed data now includes diverse foods across all meal types:

### Breakfast
- Greek Yogurt (130 cal, 22g protein)
- Banana (105 cal, 27g carbs)  
- Oatmeal (154 cal, 5.3g protein)

### Lunch
- Grilled Chicken Breast (165 cal, 31g protein)
- Brown Rice (216 cal, 45g carbs)
- Turkey Sandwich (320 cal, 25g protein)

### Dinner
- Salmon Fillet (208 cal, 25g protein)
- Quinoa (222 cal, 8.1g protein)
- Pasta with Marinara (280 cal, 12g protein)

### Snacks
- Mixed Nuts (180 cal, 16g fats)
- Apple (80 cal, 21g carbs)


## Testing

### Seed the Database
```bash
npm run seed-food
```

### Test the Endpoints
```bash
# Add a breakfast item
curl -X POST http://localhost:3000/api/food \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "foodName": "Scrambled Eggs",
    "calories": 140,
    "protein": 12,
    "carbs": 1,
    "fats": 10,
    "portionSize": "2 eggs",
    "mealTime": "breakfast"
  }'

# Get daily summary
curl http://localhost:3000/api/food/USER_ID/daily-summary

# Get breakfast foods
curl http://localhost:3000/api/food/USER_ID/meal/breakfast
``` 