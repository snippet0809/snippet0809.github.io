---
title: java8函数式编程
description: java.util.function包 & java.util.stream包
---

`函数式编程`对应的是`指令式编程`，函数式编程可以使代码更加简洁

## 一、java.util.function.Function接口

函数式编程最重要的一个特性就是将函数作为参数，在java中的语法就是传入new Function(){}匿名内部类

Function是比较泛用的接口，jdk8还有一些延伸接口（以下接口和Function非继承关系）

- public interface IntFunction\<R> { R apply(int value); }
- public interface LongFunction\<R> { R apply(long value); }
- public interface DoubleFunction\<R> { R apply(double value); }
- public interface BiFunction\<T, U, R> { R apply(T t, U u); }

- public interface IntToLongFunction { long applyAsLong(int value); }
- public interface IntToDoubleFunction { double applyAsDouble(int value); }

- public interface LongToIntFunction { int applyAsInt(long value); }
- public interface LongToDoubleFunction { double applyAsDouble(long value); }

- public interface DoubleToIntFunction { int applyAsInt(double value); }
- public interface DoubleToLongFunction { long applyAsLong(double value); }

- public interface ToIntFunction\<T> { int applyAsInt(T value); }
- public interface ToLongFunction\<T> { long applyAsLong(T value); }
- public interface ToDoubleFunction\<T> {double applyAsDouble(T value); }

- public interface ToIntBiFunction<T, U> { int applyAsInt(T t, U u); }
- public interface ToLongBiFunction<T, U> { long applyAsLong(T t, U u); }
- public interface ToDoubleBiFunction<T, U> { double applyAsDouble(T t, U t); }

```java
@FunctionalInterface
public interface Function<T, R> {

    R apply(T t);

    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }

    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }

    static <T> Function<T, T> identity() {
        return t -> t;
    }
}
```

## 二、java.util.function.Consumer接口

Consumer是特殊的Function，它在函数式编程中固定函数的返回值为void，jdk8还提供了其它延伸接口：

- public interface IntConsumer { void accept(int value); }
- public interface LongConsumer { void accept(long value); }
- public interface DoubleConsumer { void accept(double value); }
- public interface BiConsumer<T, U> { void accept(T t, U u); }

```java
@FunctionalInterface
public interface Consumer<T> {

    void accept(T t);

    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

## 三、java.util.function.Predicate接口

Predicate是特殊的Function，它在函数式编程中固定函数的返回值为boolean，jdk8还提供了其它延伸接口：

- public interface IntPredicate { boolean test(int value); }
- public interface LongPredicate { boolean test(long value); }
- public interface DoublePredicate { boolean test(double value); }
- public interface BiPredicate<T, U> { boolean test(T t, U u); }

```java
@FunctionalInterface
public interface Predicate<T> {

    // t是否满足条件，判断条件需要实现类给出
    boolean test(T t);

    // 与
    default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }

    // 非
    default Predicate<T> negate() {
        return (t) -> !test(t);
    }

    // 或
    default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }

    // ==
    static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
                ? Objects::isNull
                : object -> targetRef.equals(object);
    }

    // jdk11
    @SuppressWarnings("unchecked")
    static <T> Predicate<T> not(Predicate<? super T> target) {
        Objects.requireNonNull(target);
        return (Predicate<T>)target.negate();
    }
}
```

## 四、java.util.function.Supplier接口

Supplier是特殊的Function，它在函数式编程中固定函数参数列表为空，jdk8还提供了其它延伸接口：

- public interface IntSupplier { int getAsInt(); }
- public interface LongSupplier { long getAsLong(); }
- public interface DoubleSupplier { double getAsDouble(); }
- public interface BooleanSupplier { boolean getAsBoolean(); }

```java
@FunctionalInterface
public interface Supplier<T> {

    T get();
}
```

## 五、java.util.Optional类

Optional是jdk8新增的一个类，可以很好地防止空指针异常。可以把Optional理解为一个容器，如果值存在则isPresent()方法会返回true，调用get()方法会返回该对象。

```java
public final class Optional<T> {

    private static final Optional<?> EMPTY = new Optional<>();
    private final T value;

    private Optional() {
        this.value = null;
    }

    public static<T> Optional<T> empty() {
        @SuppressWarnings("unchecked")
        Optional<T> t = (Optional<T>) EMPTY;
        return t;
    }

    private Optional(T value) {
        this.value = Objects.requireNonNull(value);
    }

    public static <T> Optional<T> of(T value) {
        return new Optional<>(value);
    }

    public static <T> Optional<T> ofNullable(T value) {
        return value == null ? empty() : of(value);
    }

    public T get() {
        if (value == null) {
            throw new NoSuchElementException("No value present");
        }
        return value;
    }

    public boolean isPresent() {
        return value != null;
    }

    public void ifPresent(Consumer<? super T> consumer) {
        if (value != null)
            consumer.accept(value);
    }
}

```

## 六、java.util.stream.Stream接口

Stream是对数据的一种抽象，它使用一种类似SQL的方式对数据进行处理

### 1、Stream接口部分源码

```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {

    Stream<T> filter(Predicate<? super T> predicate);

    <R> Stream<R> map(Function<? super T, ? extends R> mapper);

    // 类似的还有mapToLong()、mapToDouble()
    IntStream mapToInt(ToIntFunction<? super T> mapper);

    // 类似的还有flatMapToLong()、flatMaptoDouble()
    IntStream flatMapToInt(Function<? super T, ? extends IntStream> mapper);

    Stream<T> distinct();

    Stream<T> sorted();

    Stream<T> sorted(Comparator<? super T> comparator);

    Stream<T> peek(Consumer<? super T> action);

    Stream<T> limit(long maxSize);

    Stream<T> skip(long n);

    void forEach(Consumer<? super T> action);

    void forEachOrdered(Consumer<? super T> action);

    Object[] toArray();

    <A> A[] toArray(IntFunction<A[]> generator);

    T reduce(T identity, BinaryOperator<T> accumulator);

    Optional<T> reduce(BinaryOperator<T> accumulator);

    <U> U reduce(U identity, BiFunction<U, ? super T, U> accumulator, BinaryOperator<U> combiner);

    <R> R collect(Supplier<R> supplier, BiConsumer<R, ? super T> accumulator, BiConsumer<R, R> combiner);

    <R, A> R collect(Collector<? super T, A, R> collector);

    Optional<T> max(Comparator<? super T> comparator);

    long count();

    boolean anyMatch(Predicate<? super T> predicate);

    boolean allMatch(Predicate<? super T> predicate);

    boolean noneMatch(Predicate<? super T> predicate);

    Optional<T> findFirst();

    Optional<T> findAny();

    public static<T> Builder<T> builder() {
        return new Streams.StreamBuilderImpl<>();
    }

    public static<T> Stream<T> empty() {
        return StreamSupport.stream(Spliterators.<T>emptySpliterator(), false);
    }

    public static<T> Stream<T> of(T t) {
        return StreamSupport.stream(new Streams.StreamBuilderImpl<>(t), false);
    }

    @SafeVarargs
    @SuppressWarnings("varargs") // Creating a stream from an array is safe
    public static<T> Stream<T> of(T... values) {
        return Arrays.stream(values);
    }

    public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f) {
        Objects.requireNonNull(f);
        final Iterator<T> iterator = new Iterator<T>() {
            @SuppressWarnings("unchecked")
            T t = (T) Streams.NONE;

            @Override
            public boolean hasNext() {
                return true;
            }

            @Override
            public T next() {
                return t = (t == Streams.NONE) ? seed : f.apply(t);
            }
        };
        return StreamSupport.stream(Spliterators.spliteratorUnknownSize(iterator, Spliterator.ORDERED | Spliterator.IMMUTABLE), false);
    }

    public static<T> Stream<T> generate(Supplier<T> s) {
        Objects.requireNonNull(s);
        return StreamSupport.stream(new StreamSpliterators.InfiniteSupplyingSpliterator.OfRef<>(Long.MAX_VALUE, s), false);
    }

    public static <T> Stream<T> concat(Stream<? extends T> a, Stream<? extends T> b) {
        Objects.requireNonNull(a);
        Objects.requireNonNull(b);

        @SuppressWarnings("unchecked")
        Spliterator<T> split = new Streams.ConcatSpliterator.OfRef<>((Spliterator<T>) a.spliterator(), (Spliterator<T>) b.spliterator());
        Stream<T> stream = StreamSupport.stream(split, a.isParallel() || b.isParallel());
        return stream.onClose(Streams.composedClose(a, b));
    }

    public interface Builder<T> extends Consumer<T> {

        @Override
        void accept(T t);

        default Builder<T> add(T t) {
            accept(t);
            return this;
        }

        Stream<T> build();
    }
}
```

### 2、java.util.Collection转Stream

```java
public interface Collection<E> extends Iterable<E> {

    default boolean removeIf(Predicate<? super E> filter) {
        Objects.requireNonNull(filter);
        boolean removed = false;
        final Iterator<E> each = iterator();
        while (each.hasNext()) {
            if (filter.test(each.next())) {
                each.remove();
                removed = true;
            }
        }
        return removed;
    }

    // 重写自Iterable接口
    @Override
    default Spliterator<E> spliterator() {
        return Spliterators.spliterator(this, 0);
    }

    default Stream<E> stream() {
        return StreamSupport.stream(spliterator(), false);
    }

    default Stream<E> parallelStream() {
        return StreamSupport.stream(spliterator(), true);
    }

    // ***其它实现省略***
}
```

### 3、使用示例

```java
public class StreamDemo {

    public void functionalProgramming(List<String> list) {
        // list中是有任一元素满足Predicate::test()就返回true
        boolean contains = list.stream().anyMatch("abc"::equals);
    }
}
```
