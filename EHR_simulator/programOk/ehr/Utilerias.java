package ehr;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author clopezp
 */
public class Utilerias { //I have changed the name of this class from Utilerias to Utilities
    /*public enum MState{ //States of the manufacturer
        NOTHING, TOKENIZING, MINTING, REQOWNERRIGHT; 
    }
    
    public static String getState(MState s){
        String state;
        state = switch (s) {
            case NOTHING -> "NOTHING";            
            case TOKENIZING -> "TOKENIZING";
            case MINTING -> "MINTING";                
            case REQOWNERRIGHT -> "REQOWNERRIGHT";
            default -> "NOT DEFINED";
        };
        return state;
    }

    public enum TranType{//type of transactions
        CHANGE_OWNERRIGHTS, ENDLIFECYCLE, CHANGE_STOLEN_STATUS;
        //CHANGE_OWNERRIGHTS = 100; ENDLIFECYCLE = 300; CHANGE_STOLEN_STATUS = 101;
    }
    
    public static String getTranType(TranType s){
        String t;
        t = switch (s) {
            case CHANGE_OWNERRIGHTS -> "100";            
            case ENDLIFECYCLE -> "300";
            case CHANGE_STOLEN_STATUS -> "101";                
            default -> "-1"; //not defined
        };
        return t;
    }

    public static String getCostTranType(TranType s){
        String t;
        t = switch (s) {
            case CHANGE_OWNERRIGHTS -> "450";            
            case ENDLIFECYCLE -> "150";
            case CHANGE_STOLEN_STATUS -> "400";                
            default -> "0"; //not defined
        };
        return t;
    }
    public static String getCostTranType(String s){
        String t;
        t = switch (s) {
            case "100" -> "450";            
            case "300" -> "150";
            case "101" -> "400";                
            default -> "0"; //not defined
        };
        return t;
    }
    */
    
    public void espera(int m){
        try {
            Thread.sleep(m);
        } catch (InterruptedException ex) {
            Logger.getLogger(Utilerias.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public String connectOld(String host, int port, String[] keys, String[] values, String service, String method){
        URL url;
        HttpURLConnection conn= null;
        String returnMsg=""; 
            URI uri = URI.create("http://"+host+":" + port + "/" + service);
            System.out.println("Formed URI: " + uri);
            try{
                url = uri.toURL();                                
                try {                    
                    conn = (HttpURLConnection) url.openConnection();                    
                    conn.setRequestMethod(method); 
                    String nonce = Long.toString(LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));
                    conn.setRequestProperty("X-Nonce", nonce);                    
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setDoOutput(true);        
                    String jsonMsg="",inicio = "\"";        
                    for(int i=0; i<keys.length;i++){
                        jsonMsg = jsonMsg + inicio + keys[i] + "\":\"" + values[i] + "\"";
                        inicio = ",\"";
                    }
                    jsonMsg = "{" + jsonMsg + "}";
                    String requestBody = jsonMsg;
                    OutputStream os = conn.getOutputStream();
                    os.write(requestBody.getBytes());
                    os.flush();                    
                    int responseCode = conn.getResponseCode();
                    String threadName = Thread.currentThread().getName();                        
                    System.out.println(threadName + " Response code: " + responseCode);
                    if (responseCode == HttpURLConnection.HTTP_OK) {
                        BufferedReader br = new BufferedReader(new InputStreamReader(
                        (conn.getInputStream())));
                        String output;

                        while ((output = br.readLine()) != null) {             
                            returnMsg = returnMsg + output;
                        }
                        br.close();
                        //conn.disconnect();
                    }
                    conn.disconnect();
                } catch (IOException ex) {                    
                    returnMsg="Error"; // if not error, this variable must change                    
                }
            }catch(MalformedURLException ex){
                returnMsg="Error:MalformedURLException";
            }
        return returnMsg;
    }

    public String connectWithGET(String host, int port, String[] keys, String[] values, String service) {
        URL url;
        HttpURLConnection conn = null;
        String returnMsg = ""; 
        
        try {
            // Build query parameters for the GET request
            StringBuilder queryParams = new StringBuilder();
            if (keys != null && values != null && keys.length > 0) {
                for (int i = 0; i < keys.length; i++) {
                    if (queryParams.length() > 0) {
                        queryParams.append("&");
                    } else {
                        queryParams.append("?");
                    }
                    queryParams.append(java.net.URLEncoder.encode(keys[i], java.nio.charset.StandardCharsets.UTF_8))
                            .append("=")
                            .append(java.net.URLEncoder.encode(values[i], java.nio.charset.StandardCharsets.UTF_8));
                }
            }
            
            URI uri = URI.create("http://" + host + ":" + port + "/" + service + queryParams.toString());
            System.out.println("Formed URI: " + uri);
            
            url = uri.toURL();                                
            conn = (HttpURLConnection) url.openConnection();                    
            conn.setRequestMethod("GET"); 
            
            String nonce = Long.toString(LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));
            conn.setRequestProperty("X-Nonce", nonce);                    
            conn.setRequestProperty("Accept", "application/json");
            
            // Note: setDoOutput(true) and getOutputStream() are removed for GET requests.
            
            int responseCode = conn.getResponseCode();
            String threadName = Thread.currentThread().getName();                        
            System.out.println(threadName + " Response code: " + responseCode);
            
            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                    String output;
                    while ((output = br.readLine()) != null) {             
                        returnMsg = returnMsg + output;
                    }
                }
            } else {
                returnMsg = "Error: Response code " + responseCode;
            }
        } catch (IOException ex) {                    
            returnMsg = "Error";                    
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
        return returnMsg;
    }

    public String connectWithPOST(String host, int port, String[] keys, String[] values, String service) {
        URL url;
        HttpURLConnection conn = null;
        String returnMsg = ""; 
        
        try {
            URI uri = URI.create("http://" + host + ":" + port + "/" + service);
            System.out.println("Formed URI: " + uri);
            
            url = uri.toURL();                                
            conn = (HttpURLConnection) url.openConnection();                    
            
            // Explicitly set the method to POST
            conn.setRequestMethod("POST"); 
            
            String nonce = Long.toString(LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));
            conn.setRequestProperty("X-Nonce", nonce);                    
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            
            // Required for POST requests to send a request body
            conn.setDoOutput(true);        
            
            // Build JSON body from keys and values
            String jsonMsg = "", inicio = "\"";        
            if (keys != null && values != null) {
                for (int i = 0; i < keys.length; i++) {
                    jsonMsg = jsonMsg + inicio + keys[i] + "\":\"" + values[i] + "\"";
                    inicio = ",\"";
                }
            }
            jsonMsg = "{" + jsonMsg + "}";
            
            // Write the JSON body to the output stream
            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonMsg.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                os.flush();                    
            }
            
            int responseCode = conn.getResponseCode();
            String threadName = Thread.currentThread().getName();                        
            System.out.println(threadName + " Response code: " + responseCode);
            
            if (responseCode == HttpURLConnection.HTTP_OK || responseCode == HttpURLConnection.HTTP_CREATED) {
                try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                    String output;
                    while ((output = br.readLine()) != null) {             
                        returnMsg = returnMsg + output;
                    }
                }
            } else {
                returnMsg = "Error: Response code " + responseCode;
            }
        } catch (IOException ex) {                    
            returnMsg = "Error";                    
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
        return returnMsg;
    }


}
