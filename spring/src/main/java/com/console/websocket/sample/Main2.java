package com.console.websocket.sample;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import io.reactivex.Observable;

// https://github.com/jacek-marchwicki/JavaWebsocketClient
public class Main2 {
    public static void main(String[] args) {
        // https://github.com/ReactiveX/RxJava/wiki/Creating-Observables#create
        handshaker()
            .flatMap(Main2::relay)
            .subscribe(System.out::println);
    }

    // https://github.com/ReactiveX/RxJava/wiki/Creating-Observables#fromfuture
    // private static ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
    private static ExecutorService executor = Executors.newFixedThreadPool(2);
    private static Observable<WebSock> handshaker(){
        List<Future<WebSock>> list = new ArrayList<>();

        int i = 2;
        while(0 <= --i){
            Future<WebSock> future = executor.submit(() -> {
                Thread.currentThread().sleep(2000);
                WebSock socket = new WebSock();
                System.out.println("CONNECTED :: " + socket);
                return socket;
            });
            list.add(future);
        }

        return Observable.fromIterable(list)
                .flatMap(f -> Observable.fromFuture(f))
                .delay(10, TimeUnit.SECONDS);
    }

    /*
     * Monad
     */
    private static Observable<Exchange> relay(WebSock in){
        Exchange ex = new Exchange();
        ex.in = in;


        // return Observable.just(ex);
        Observable<String> info = runningServerInfo();
        return info
            .flatMap(server -> {
                Future<WebSock> future = executor.submit(() -> {
                    // Thread.currentThread().sleep(1000);
                    WebSock socket = new WebSock("relay-of-" + in.id + "-to-" + server);
                    // System.out.println("CONNECTED :: " + socket);
                    return socket;
                });
                return Observable.fromFuture(future);
            })
            .flatMap(out -> {
                ex.out = out;
                return Observable.just(ex);
            });
    }
    
    private static Observable<String> running = null;
    private static Observable<String> runningServerInfo(){
        if(running != null)
            return running;
        
        Future<String> future = executor.submit(() -> {
            String server = "KUBE";

            System.out.println("REQ :: " + server);
            Thread.currentThread().sleep(1000 * 5);
            System.out.println("RES :: " + server);
            return server;
        });

		running = Observable.fromFuture(future);
        return running;
    }

    /*
     * Data Class
     */
    private static class WebSock {
        private static int count = 0;

        public String id;

        public WebSock() { this.id = String.valueOf(++count); }
        public WebSock(String id) { this.id = id; }

        public String toString() { return "WebSock(" + id + ")"; }

        public void send(String msg){
            System.out.format("-> (%s) :: '%s'\n", id, msg);
        }
    }

    private static class Exchange {
        public WebSock in;
        public WebSock out;

        public String toString() {
            return "Exchange :: [" + in + " <-> " + out + "]";
        }
    }
}