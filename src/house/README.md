# Autonomous Software Agents - Deliverable 2

## Background
Deliverable 2 proposes a recipe for the implementation of a Smart House.

The code is structured as follows:
    
    đ Blueprints
    đ Planner
      đ house
      |  đ HouseLayout.js
      |  đ HouseWorld.js
      |  đ houseWorld.log
      |  âšī¸ README.md
      đ src
      |  đ bdi
      |  đ houseworld
      |    đ AntiIntrusionSystem.js
      |    đ CoffeeMachine.js
      |    đ HeatPump.js
      |    đ Light.js
      |    đ LightManagement.js
      |    đ MovementSensor.js
      |    đ Person.js
      |    đ Room.js
      |  đ utils
      |    đ Clock.js
      |    đ Observable.js

[`house`](../house/) directory contains a [`HouseLayout`](HouseLayout.js) file that - intuitively - provides an explanation of the house's layout. Specifically, in this file we define a `House` class to specify:
+ *rooms*
+ *devices* like *lights*, *thermostats*, *appliances*, etc.
+ *residents*, and
+ *anti intrusion system*

Each and every one of the abovementioned devices, however, are defined in separate classes placed in the [`houseworld`](../src/houseworld/) directory.


---

## đ Weekly Schedule
We simulate a weekly schedule with **fixed** actions based on time and dayin the format `(dd:hh:mm)`. Time simulation is managed by the [Clock Class](../src/utils/Clock.js) which has also been slightly modified with respect to the original so as to also support **weekly** scheduling. \
Actions are designed for moving residents around the house, to compute smart devices consumption, etc. *Table1* shows the main actions in use.

âšī¸ Please refer to the *Residents Section* in the [Report](../../Blueprints/Report1%20ASA.pdf) file for further details on why actions are performed in such an order and for insights about future implementations.

<!-- Actions Table -->
<table border="1" class="dataframe">
  <caption><i>Table1: Scheduling Actions Table</caption>
  <thead>
    <tr style="text-align: center">
      <th>Action</th>
      <th>Precondition</th>
      <th>Effect</th>
    </tr>
  </thead>
  <tbody style="text-align: left";>
    <tr>
      <th><code>.switchOn()</code></th>
      <td>Light needs to be switched off.</td>
      <td>Switches on a light-like device.</td>
    </tr>
    <tr>
      <th><code>.switchOff()</code></th>
      <td>Light needs to be switched on.</td>
      <td>Switches off a light-like device.</td>
    </tr>
    <tr>
      <th><code>.turnOn()</code></th>
      <td>
        âĸ Room's temperature not ideal.<br>
        âĸ Coffee machine is turned off.
      </td>
      <td>
        âĸ Turns on the heating/AC for a room.<br>
        âĸ Coffee machine is turned on.
      </td>
    </tr>
    <tr>
      <th><code>.turnOff()</code></th>
      <td>
        âĸ Room's temp. reached ideal.<br>
        âĸ Coffee machine is turned on.
      </td>
      <td>
        âĸ Turns off the heating/AC for a room.<br>
        âĸ Coffee machine is turned off.
      </td>
    </tr>

---

## đ¤ Smart Agent
In this recipe of a weekly schedule, a single **smart agent** has been implemented with the aim of managing lights. The agent is capable of detecting the presence of an individual inside a room and turn on that room's light as a result. On the contrary, when no resident is in a specific room, the agent turns off the room's light to save in electricity consumption. The agent's sensoring implementation is 
available at the [MovementSensor](../src/houseworld/MovementSensor.js) file, the light management is insteas available at the [LightManagement](../src/houseworld/LightManagement.js) file.

## đ Future Development
Movement sensoring will be exploited for a future development of a more sophisticated **anti-intrusion system**. \
Further developments might also include an improved version of the **heating/cooling** system and an implementation of an autonomous **vacuum cleaner**.

---

*Attachments:*



