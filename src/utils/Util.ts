export class Util {
    public static lequal(a: any[] , b: any[]) {
        return (a.length == b.length);
    }
    
    public static glequal(a: any[] , b: any[]) {
        return (a.length >= b.length);
    }
    
    public static llequal(a: any[] , b: any[]) {
        return (a.length <= b.length);
    }
    public static logStep() {
        console.log("\n----------------------------------------------------------------------\n");
    }
}