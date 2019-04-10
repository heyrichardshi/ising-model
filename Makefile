all:
	g++ -o ising main.cpp -std=c++11
clean: 
	$(RM) ising
