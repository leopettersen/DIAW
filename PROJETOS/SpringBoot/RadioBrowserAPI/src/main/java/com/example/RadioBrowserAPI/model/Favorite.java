package com.example.RadioBrowserAPI.model;

public class Favorite {
    private String clienteId;
    private String stationuuid;
    private String name;
    private String favicon;
    private String url;
    public String getClienteId() {
        return clienteId;
    }
    public void setClienteId(String clienteId) {
        this.clienteId = clienteId;
    }
    public String getStationuuid() {
        return stationuuid;
    }
    public void setStationuuid(String stationuuid) {
        this.stationuuid = stationuuid;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getFavicon() {
        return favicon;
    }
    public void setFavicon(String favicon) {
        this.favicon = favicon;
    }
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
}
