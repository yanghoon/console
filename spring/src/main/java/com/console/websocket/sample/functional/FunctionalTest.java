package com.console.websocket.sample.functional;

import java.util.function.Function;

public class FunctionalTest {
    public static void main(String[] args) {
        FunctionalTest functionalTest = new FunctionalTest();
        functionalTest.testPureFunctionComposite();
    }

    public void testPureFunctionComposite(){
        for (int v = 0; v < 100; v++) {
            final int x = v;
            new Thread(() -> System.out.println(i.apply(x))).start();
        }
    }

    Function<Integer, Integer> f = x -> x + 2;
    Function<Integer, Integer> g = x -> x * 2;
    Function<Integer, Integer> h = x -> x - 2;
    Function<Integer, Integer> i = f.andThen(g).andThen(h);
}
