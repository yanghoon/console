package com.console.websocket.sample;

import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.ObservableOnSubscribe;
import io.reactivex.ObservableSource;
import io.reactivex.functions.Function;

// https://github.com/jacek-marchwicki/JavaWebsocketClient
public class Main2 {
    public static void main(String[] args) {
        // https://github.com/ReactiveX/RxJava/wiki/Creating-Observables#create
        Observable<WebSock> ob = Observable.create(new ClientHandshaker());
        ob.flatMap(relayCreator)
          .subscribe(System.out::println);

        Future<WebSock> connectEvent = executor.schedule(()->{ return null; }, 10, TimeUnit.SECONDS);
    }

    // https://github.com/ReactiveX/RxJava/wiki/Creating-Observables#fromfuture
    private static ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
    private static class ClientHandshaker implements ObservableOnSubscribe {
        public void subscribe(ObservableEmitter emitter) throws Exception {
            emitter.onNext(new WebSock("1"));
            emitter.onNext(new WebSock("2"));
		}
    }

    /*
     * Subscriber
     */
    private static Function<WebSock, ObservableSource<Exchange>> relayCreator = new Function<WebSock, ObservableSource<Exchange>>() {
        public ObservableSource<Exchange> apply(WebSock socket) throws Exception {
            Exchange ex = new Exchange();
            ex.in = socket;
            ex.out = new WebSock("relay-of-" + socket.id);
            return Observable.just(ex);
        }
    };

    /*
     * Data Class
     */
    private static class WebSock {
        public String id;
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