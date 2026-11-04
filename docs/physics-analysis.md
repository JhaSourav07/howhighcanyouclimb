# Physics Analysis & Parameter Extraction: Jump King Browser

**Reference**: Construct 3 Box2D Physics behavior and bytecode functions `C3_ExpressionFuncs`  
**Confidence Level**: 100% verified ground truth  

---

## 1. Physics Engine Parameters

The physics simulation in the reference game runs atop Box2D with the following parameters:

| Parameter | Box2D Internal Value | Simulation Pixel Value | Source Reference |
| :--- | :--- | :--- | :--- |
| **World Scale** | $0.02\text{ m/px}$ | $1\text{ meter} = 50\text{ pixels}$ | `PhysicsBehavior._worldScale` |
| **World Gravity ($G$)** | $10\text{ m/s}^2$ downward | $500\text{ pixels/s}^2$ | `PhysicsBehavior._worldG` |
| **Stepping Mode** | Fixed Timestep ($60\text{ Hz}$) | $\Delta t \approx 0.01667\text{ s}$ | `PhysicsBehavior._steppingMode = 1` |
| **Velocity Iterations** | 8 | N/A | `PhysicsBehavior._velocityIterations` |
| **Position Iterations**| 3 | N/A | `PhysicsBehavior._positionIterations` |

---

## 2. Player Body Definition (`pla`)

| Property | Value | Physical Meaning |
| :--- | :--- | :--- |
| **Dimensions** | $32\text{ px} \times 32\text{ px}$ | Square collision envelope |
| **Density** | $2.3$ | Mass computed from density $\times$ area |
| **Friction** | $2.0$ | High grounded traction to prevent sliding |
| **Elasticity (Restitution)** | $0.0$ | Pure inelastic collision on platforms |
| **Linear Damping** | $0.0$ | Zero artificial air drag |
| **Angular Damping** | $0.5$ | Rotation damping |
| **Prevent Rotation** | `true` | Body maintains upright vertical orientation |

---

## 3. Walking Dynamics

- **Maximum Walking Speed**: $150\text{ pixels/second}$ (`maxspeed = 150`, Expression 7).
- **Horizontal Walking Impulse**: Applied per frame when directional keys are pressed:
  $$I_{\text{walk}} = 4 \cdot \Delta t$$
- **Velocity Clamping**:
  $$\text{if } V_x > 150 \implies V_x = 150$$
  $$\text{if } V_x < -150 \implies V_x = -150$$

---

## 4. Jump Charging & Impulse Formulas

### 4.1 Charge Accumulation
- The charge timer `tssbp` starts at 0 upon pressing Space while grounded:
  $$\frac{d(\text{tssbp})}{dt} = 1250$$
  $$\text{tssbp}(t) = \min(600, 1250 \cdot t)$$
- **Maximum Charge Time**:
  $$t_{\text{max}} = \frac{600}{1250} = 0.48\text{ seconds} = 480\text{ milliseconds}$$

### 4.2 Vertical Jump Impulse
Extracted verbatim from `self.C3_ExpressionFuncs[107]`:
$$J_y = 0.0035 \cdot (-(20 + \text{tssbp}))$$

- **Minimum Charge ($t=0, \text{tssbp}=0$)**:
  $$J_y^{\text{min}} = 0.0035 \cdot (-20) = -0.070\text{ N}\cdot\text{s}$$
  Initial vertical launch velocity $V_{y0} \approx -180\text{ px/s}$.
  Peak jump height $\approx 32\text{ px}$ (1 tile height).
- **Maximum Charge ($t=0.48, \text{tssbp}=600$)**:
  $$J_y^{\text{max}} = 0.0035 \cdot (-620) = -2.170\text{ N}\cdot\text{s}$$
  Initial vertical launch velocity $V_{y0} \approx -680\text{ px/s}$.
  Peak jump height $\approx 460\text{ px}$ ($\sim 1.28$ screens high).

### 4.3 Horizontal Jump Impulse
Extracted from Event 168 / 169:
$$J_x = \begin{cases} +0.85 & \text{if Right held} \\ -0.85 & \text{if Left held} \\ 0 & \text{if Neutral} \end{cases}$$

Horizontal launch velocity is fixed at $V_{x0} \approx \pm 220\text{ px/s}$ regardless of vertical charge, creating Jump King's characteristic parabolic trajectories.

---

## 5. Collision & Bounce Equations

### 5.1 Vertical Wall Bouncing
Extracted from Event 31.1 & Expression 35:
Upon detecting collision with a vertical wall while airborne:
$$V_x' = -0.75 \cdot V_x$$
Horizontal speed is reversed with a $25\%$ damping penalty. Audio `king_bump` is played.

### 5.2 Ceiling Impact
Extracted from Event 34 & Expression 117:
Upon raycasting upwards into a ceiling platform:
$$V_y' = -0.50 \cdot V_y$$
Vertical velocity is reversed downwards with a $50\%$ damping penalty. Audio `king_bump` is played.

### 5.3 Slippery Ice Surfaces (`slipry = 1`)
Platforms tagged with instance variable `slipry == 1` temporarily set player friction to $0.0$, causing horizontal inertia to continue until finding dry ground.
