function RandomInt(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min);
}

const J = 0.5;
const N = 128;
const seed_probability = 0.65;
let lattice = [];
let total_H = 0;

// creating N*N array
for (let i = 0; i < N; i++) {
  lattice.push(new Array(N));
}

// seeding values
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    lattice[i][j] = Math.random() < seed_probability ? 1 : -1;
  }
}

// calculate total H
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
      total_H += -J * lattice[i][j] * (lattice[(i - 1 + N) % N][j] +
                                       lattice[(i + 1) % N][j] +
                                       lattice[i][(j - 1 + N) % N] +
                                       lattice[i][(j + 1) % N]);
  }
}

for (let a = 0; a < 10000; a++) {
  for (let b = 0; b < N * N; b++) {
    let k = RandomInt(0, N * N - 1);
    let i = Math.floor(k / N);
    let j = k % N;
    let delta_H = 2 * J * lattice[i][j] * (lattice[(i - 1 + N) % N][j] +
                                           lattice[(i + 1)     % N][j] +
                                           lattice[i][(j - 1 + N) % N] +
                                           lattice[i][(j + 1)     % N]);
    // need to consider flip effect on surrounding cells
    let neighbor_H = 2 * J * (lattice[(i - 1 + N) % N][j] * lattice[i][j] +
                              lattice[(i + 1)     % N][j] * lattice[i][j] +
                              lattice[i][(j - 1 + N) % N] * lattice[i][j] +
                              lattice[i][(j + 1)     % N] * lattice[i][j]);
    if (delta_H < 0) {
      lattice[i][j] *= -1;
      total_H += delta_H + neighbor_H;
    } else {
      let reduced_probability = Math.exp(-delta_H);
      if (Math.random() < reduced_probability) {
          lattice[i][j] *= -1;
          total_H += delta_H + neighbor_H;
      }
    }
  }
  // output total_H
  console.log(a + " | " + Math.abs(total_H));
}