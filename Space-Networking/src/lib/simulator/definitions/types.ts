export interface InterceptInputCartesian {
  A: { x: number; y: number };   // Stationary signal source
  O: { x: number; y: number };   // Circle center (planet)
  B: { x: number; y: number };   // Current orbiter position
  r: number;                     // Orbit radius
  vo: number;                    // Orbiter tangential speed
  vl: number;                    // Signal (line) speed
  ccw?: boolean;                 // Counterclockwise orbit? (default true)
  maxIter?: number;              // Newton iterations (default 60)
  tol?: number;                  // Convergence tolerance (default 1e-12)
  damping?: number;              // Damping factor (default 0.5)
}

export interface InterceptResult {
  ok: boolean;
  thetaHit?: number;
  distance?: number;
  time?: number;
  x?: number;
  y?: number;
  iterations?: number;
  message?: string;
}

export function interceptFromCartesian(params: InterceptInputCartesian): InterceptResult {
  const {
    A, O, B, r, vo, vl,
    ccw = true, maxIter = 60, tol = 1e-12, damping = 0.5,
  } = params;

  if (!(r > 0)) return { ok: false, message: "r must be > 0" };
  if (!(vl > 0)) return { ok: false, message: "vl must be > 0" };
  if (vo < 0) return { ok: false, message: "vo must be >= 0" };

  // Geometry
  const OA_x = A.x - O.x;
  const OA_y = A.y - O.y;
  const d = Math.hypot(OA_x, OA_y);
  const phi = Math.atan2(OA_y, OA_x); // fixed angle of A around O

  // Compute θ₀ from current orbiter coordinates
  const OB_x = B.x - O.x;
  const OB_y = B.y - O.y;
  const theta0 = Math.atan2(OB_y, OB_x);

  const omegaMag = vo / r;
  const omega = ccw ? +omegaMag : -omegaMag;

  // L(θ): distance from A to point on circle at angle θ
  const L = (theta: number): number => {
    const c = Math.cos(theta - phi);
    const L2 = d * d + r * r - 2 * d * r * c;
    return Math.sqrt(Math.max(L2, 0));
  };

  // f(θ) = θ - θ₀ - (ω/vℓ)*L(θ)
  const f = (theta: number): number => theta - theta0 - (omega / vl) * L(theta);

  // f'(θ)
  const df = (theta: number): number => {
    const len = L(theta);
    if (len === 0) return 1;
    const dL = (d * r * Math.sin(theta - phi)) / len;
    return 1 - (omega / vl) * dL;
  };

  const TWO_PI = Math.PI * 2;
  const wrapNear = (base: number, x: number) => {
    const k = Math.round((x - base) / TWO_PI);
    return x - k * TWO_PI;
  };

  // Initial guess
  let theta = wrapNear(theta0, theta0 + (omega / vl) * L(theta0));

  let it = 0;
  for (; it < maxIter; it++) {
    const ft = f(theta);
    if (Math.abs(ft) < tol) break;

    let dft = df(theta);
    if (!Number.isFinite(dft)) dft = 0;
    let step = (Math.abs(dft) > 1e-14) ? (ft / dft) : (Math.sign(ft) * 1e-6);
    step *= (1 - damping);
    theta = wrapNear(theta0, theta - step);
  }

  if (it >= maxIter)
    return { ok: false, message: "Did not converge", iterations: it };

  const distance = L(theta);
  const time = distance / vl;

  return {
    ok: true,
    thetaHit: theta,
    distance,
    time,
    x: distance * Math.cos(theta),
    y: distance * Math.sin(theta),
    iterations: it,
  };
}
