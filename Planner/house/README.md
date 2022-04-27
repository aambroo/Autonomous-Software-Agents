# Autonomous Software Agents

# Deliverable 2
Please refer to the file [`house4.js`](./house4.js) which extends the original [`scenario4.js`](../src/houseworld/scenario4.js).

## Background
The code implementation for house 4 is based on the [`Scenario 4`](../src/houseworld/scenario4.js) file. \
In the original file a new `House` class is created. Such a class allows, in turn, for building:
+ **People**: based on the [Person Class](../src/houseworld/Person.js).
+ **Devices**: based on the [Light Class](../src/houseworld/Light.js) and on the [Light Sensor Class](../src/houseworld/LightSensor.js).
+ **Alarm**: based on the [Alarm Class](../src/houseworld/Alarm.js).

Improvement of Scenario 4 consists of the introduction of the following classes:
+ **CoffeeMachine** (*observable*)

---

## Daily Schedule
We simulate a daily schedule with **fixed** actions based on time, under the form: `(hh:mm)`. Time is managed in the [Clock Class](../src/utils/Clock.js).
Actions should be organized and planned based on the [Report](../../Blueprints/Report1%20ASA.pdf). Please refer to this file for further details on why actions are performed in such order, explanation of the rooms layout, and insights about future implementaitons.

### Household
Currently, the household is composed of:
+ **residents**: `man` and `woman`
+ **devices**: `kitchen_light`, `living_room_light`, `garage_light`, and `coffee_machine`
+ **utilities**: `electricity`

### Actions
Static actions performed during the daily schedule are the following:
+ `switchOnLight()`: switches on a light
+ `switchOffLight()`: switches off a light
+ `allLightsOff()`: turns off all light devices
+ `turnOn()`: turns on the coffee machine
+ `turnOff()`: turns off the coffee machine
+ `moveTo()`: moves a resident from the room they are currently in, to an adjacent one. If rooms are not adjacent, then moving action is not performed.
---
### Comments

