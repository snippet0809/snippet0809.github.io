```java
public class SortMap() {

    private static Map<String, Integer> map = new HashMap();

    static {
        map.put("a", 3);
        map.put("b", 2);
        map.put("c", 1);
    }

    /**
     * 根据key正序排序
     */
    public static LinkedHashMap<String, Integer> sortByKey() {
        return map.entrySet().stream().sorted(Entry.comparingByKey())
                .collect(Collectors.toMap(Entry::getKey, Entry::getValue, (oldValue, newValue) -> oldValue, LinkedHashMap::new));
    }

    /**
     * 根据value倒序排序
     */
    public static LinkedHashMap<String, Integer> sortByValue() {
        return map.entrySet().stream().sorted(Entry.comparingByValue(Comparator.reverseOrder()))
                .collect(Collectors.toMap(Entry::getKey, Entry::getValue, (oldValue, newValue) -> oldValue, LinkedHashMap::new));
    }
}
```