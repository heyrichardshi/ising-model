#include <iostream>
#include <fstream>
#include <cmath>

#include "random.hpp"

using namespace std;

int main(int argc, char *argv[]) {
    const double J = 0.1;
    const int N = 128;
    const double p = 0.65;
    int lattice[N][N] = {0};
    double total_H = 0;

    // make lattice
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            lattice[i][j] = RandomUniform() <= p ? 1 : -1;
        }
    }

    // calculate total H
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            total_H += -J * lattice[i][j] * (lattice[(i - 1 + N) % N][j] +
                                             lattice[(i + 1) % N][j] +
                                             lattice[i][(j - 1 + N) % N] +
                                             lattice[i][(j + 1) % N]);
        }
    }

    ofstream out;
    out.open("ising.txt");


    for (int a = 0; a < 10000; a++) { // 10,000 monte carlo steps
        for (int b = 0; b < N * N; b++) { // N * N attempted moves per step
            int k = RandomInt(0, N * N - 1);
            int i = k / N;
            int j = k % N;
            double sum_neighbors = lattice[(i - 1 + N) % N][j] +
                                   lattice[(i + 1)     % N][j] +
                                   lattice[i][(j - 1 + N) % N] +
                                   lattice[i][(j + 1)     % N];
            double H_initial = -J * lattice[i][j] * sum_neighbors;
            double H_final = J * lattice[i][j] * sum_neighbors;
            if (H_final < H_initial) {
                lattice[i][j] *= -1;
                total_H += H_final - H_initial;
            }
            else {
                double red = exp(H_initial - H_final);
                if (RandomUniform() < red) {
                    lattice[i][j] *= -1;
                    total_H += H_final - H_initial;
                }
            }
//            out << (a * N) + b << " " << abs(total_H) << endl;
        }
        out << a << " " << abs(total_H) << endl;
        cout << a << " | " << abs(total_H) << endl;
    }
}

