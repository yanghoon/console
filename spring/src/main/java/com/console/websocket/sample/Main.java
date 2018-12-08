package com.console.websocket.sample;

import io.reactivex.Observable;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Start");

        Observable<String> ob = users()
            .filter(user -> user.age > 30)
            .map(user -> user.name);
            // .subscribe(System.out::println)

        ob.subscribe(System.out::println);
        ob.subscribe(System.out::println);
        ob.subscribe(System.out::println);

        System.out.println("=== End");
    }

    private static Observable<User> users() {
        return Observable.just(
            new User("Hong", 29),
            new User("Yang", 32),
            new User("Kim", 37)
        );
    }

    public static class User {
        public String name;
        public int age;

        public User(String name, int age) {
            this.name = name;
            this.age = age;
        }
    }
}