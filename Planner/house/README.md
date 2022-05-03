# Autonomous Software Agents

# Deliverable 2

## Background
The code implementation for house 4 is based on the [`Scenario 4`](../src/houseworld/scenario4.js) file. \

The main modifications made to the original file are:
+ the House file has been split into two separate files, namely [HouseLayout](HouseLayout.js) and [HouseWorld](HouseWorld.js). Intuitively, the first contains the constructor for the household's *residents*, *devices*, *appliances*, etc. whereas the secon only includes the instructions to perform on a weekly-basis.

---

## 🗓 Weekly Schedule
We simulate a weekly schedule with **fixed** actions based on time and dayin the format `(dd:hh:mm)`. Time simulation is managed by the [Clock Class](../src/utils/Clock.js) which has also been slightly modified with respect to the original in order to support weekly instead of only daily scheduling. \
Actions are designed for moving residents around the house, to compute smart devices consumption, etc. The table below shows the main actions in use.

ℹ️ Please refer to the *Residents Section* in the [Report](../../Blueprints/Report1%20ASA.pdf) file for further details on why actions are performed in such an order and for insights about future implementations.

<!-- Actions Table -->
<table border="1" class="dataframe">
  <caption><b>Scheduling Actions Table</caption>
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
        • Room's temperature not ideal.<br>
        • Coffee machine is turned off.
      </td>
      <td>
        • Turns on the heating/AC for a room.<br>
        • Coffee machine is turned on.
      </td>
    </tr>
    <tr>
      <th><code>.turnOff()</code></th>
      <td>
        • Room's temp. reached ideal.<br>
        • Coffee machine is turned on.
      </td>
      <td>
        • Turns off the heating/AC for a room.<br>
        • Coffee machine is turned off.
      </td>
    </tr>

---

## 🤖 Smart Agent
In this recipe of a weekly schedule, a single **smart agent** has been implemented with the aim of managing lights. The agent is capable of detecting the presence of an individual inside a room and turn on that room's light as a result. On the contrary, when no resident is in a specific room, the agent turns off the room's light to save in electricity consumption. The agent's sensoring implementation is 
available at the [MovementSensor](../src/houseworld/MovementSensor.js) file, the light management is insteas available at the [LightManagement](../src/houseworld/LightManagement.js) file.

## 🚀 Future Development
Movement sensoring will be exploited for a future development of an **anti-intrusion system**. 



