/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.


var Main;
(function (Main) {
    Main.pluginName = "fabric8-console";
    Main.log = Logger.get(Main.pluginName);
    Main.templatePath = "plugins/main/html";
    Main.chatServiceName = "letschat";
    Main.grafanaServiceName = "grafana";
    Main.appLibraryServiceName = "app-library";
})(Main || (Main = {}));

var Main;
(function (Main) {
    Main._module = angular.module(Main.pluginName, []);
    var tab = undefined;
    Main._module.config(["$locationProvider", "$routeProvider", "HawtioNavBuilderProvider", function ($locationProvider, $routeProvider, builder) {
    }]);
    Main._module.run(["$rootScope", "HawtioNav", "KubernetesModel", "ServiceRegistry", "Logger", "Configuration", function ($rootScope, nav, KubernetesModel, ServiceRegistry, Logger, Configuration) {
        if (Configuration.platform === 'fabric8') {
            var apiEndpointConfig = Configuration.api.endpoint.toLowerCase();
            var dynamicEndpoint;
            $rootScope.$on('kubernetesModelUpdated', function () {
                if (apiEndpointConfig.indexOf("dynamic") === 0) {
                    var namespace = KubernetesModel.currentNamespace();
                    var hasService = ServiceRegistry.hasService("apiman");
                    if (hasService === true && namespace !== null) {
                        var service = KubernetesModel.getService(namespace, "apiman");
                        Logger.debug("apiman route: " + service.$connectUrl);
                        Logger.debug("apiman proxyUrl: " + service.proxyUrl);
                        Logger.debug("apiman serviceUrl: " + service.$serviceUrl);
                        if (apiEndpointConfig === "dynamicServiceUrl") {
                            dynamicEndpoint = service.$serviceUrl + "apiman";
                        }
                        else if (apiEndpointConfig === "dynamicProxyUrl") {
                            dynamicEndpoint = service.proxyUrl + "apiman";
                        }
                        else {
                            dynamicEndpoint = service.$connectUrl + "apiman";
                        }
                        if (Configuration.api.endpoint !== dynamicEndpoint) {
                            Configuration.api.endpoint = dynamicEndpoint;
                            Logger.debug("apiman route: {0}", service.$connectUrl);
                            Logger.debug("apiman proxyUrl: {0} ", service.proxyUrl);
                            Logger.debug("apiman serviceUrl: {0}", service.$serviceUrl);
                            Logger.info("Apiman Dynamic Endpoint: {0}", dynamicEndpoint);
                        }
                    }
                    else {
                        Configuration.api.endpoint = "no-apiman-running-in-" + namespace + "-namespace";
                    }
                }
            });
        }
        nav.on(HawtioMainNav.Actions.CHANGED, Main.pluginName, function (items) {
            items.forEach(function (item) {
                switch (item.id) {
                    case 'forge':
                    case 'jvm':
                    case 'wiki':
                    case 'docker-registry':
                        item.isValid = function () { return false; };
                }
            });
        });
        nav.add({
            id: 'library',
            title: function () { return 'Library'; },
            tooltip: function () { return 'View the library of applications'; },
            isValid: function () { return ServiceRegistry.hasService(Main.appLibraryServiceName) && ServiceRegistry.hasService("app-library-jolokia") && !Core.isRemoteConnection(); },
            href: function () { return "/wiki/view"; },
            isActive: function () { return false; }
        });
        var kibanaServiceName = Kubernetes.kibanaServiceName;
        nav.add({
            id: 'kibana',
            title: function () { return 'Logs'; },
            tooltip: function () { return 'View and search all logs across all containers using Kibana and ElasticSearch'; },
            isValid: function () { return ServiceRegistry.hasService(kibanaServiceName) && !Core.isRemoteConnection(); },
            href: function () { return Kubernetes.kibanaLogsLink(ServiceRegistry); },
            isActive: function () { return false; }
        });
        nav.add({
            id: 'apiman',
            title: function () { return 'API Management'; },
            tooltip: function () { return 'Add Policies and Plans to your APIs with Apiman'; },
            isValid: function () { return ServiceRegistry.hasService('apiman') && !Core.isRemoteConnection(); },
            href: function () { return "/api-manager"; }
        });
        nav.add({
            id: 'grafana',
            title: function () { return 'Metrics'; },
            tooltip: function () { return 'Views metrics across all containers using Grafana and InfluxDB'; },
            isValid: function () { return ServiceRegistry.hasService(Main.grafanaServiceName) && !Core.isRemoteConnection(); },
            href: function () { return ServiceRegistry.serviceLink(Main.grafanaServiceName); },
            isActive: function () { return false; }
        });
        nav.add({
            id: "chat",
            title: function () { return 'Chat'; },
            tooltip: function () { return 'Chat room for discussing this namespace'; },
            isValid: function () { return ServiceRegistry.hasService(Main.chatServiceName) && !Core.isRemoteConnection(); },
            href: function () {
                var answer = ServiceRegistry.serviceLink(Main.chatServiceName);
                if (answer) {
                }
                return answer;
            },
            isActive: function () { return false; }
        });
        Main.log.debug("loaded");
    }]);
    hawtioPluginLoader.addModule(Main.pluginName);
})(Main || (Main = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzLmpzIiwibWFpbi90cy9tYWluR2xvYmFscy50cyIsIm1haW4vdHMvbWFpblBsdWdpbi50cyJdLCJuYW1lcyI6WyJNYWluIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDZUEsSUFBTyxJQUFJLENBYVY7QUFiRCxXQUFPLElBQUksRUFBQyxDQUFDO0lBRUFBLGVBQVVBLEdBQUdBLGlCQUFpQkEsQ0FBQ0E7SUFFL0JBLFFBQUdBLEdBQW1CQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxlQUFVQSxDQUFDQSxDQUFDQTtJQUU3Q0EsaUJBQVlBLEdBQUdBLG1CQUFtQkEsQ0FBQ0E7SUFHbkNBLG9CQUFlQSxHQUFHQSxVQUFVQSxDQUFDQTtJQUM3QkEsdUJBQWtCQSxHQUFHQSxTQUFTQSxDQUFDQTtJQUMvQkEsMEJBQXFCQSxHQUFHQSxhQUFhQSxDQUFDQTtBQUVuREEsQ0FBQ0EsRUFiTSxJQUFJLEtBQUosSUFBSSxRQWFWOztBQ0pELElBQU8sSUFBSSxDQTBKVjtBQTFKRCxXQUFPLElBQUksRUFBQyxDQUFDO0lBRUFBLFlBQU9BLEdBQUdBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLGVBQVVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO0lBRXBEQSxJQUFJQSxHQUFHQSxHQUFHQSxTQUFTQSxDQUFDQTtJQUVwQkEsWUFBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxnQkFBZ0JBLEVBQUVBLDBCQUEwQkEsRUFDL0VBLFVBQUNBLGlCQUFpQkEsRUFBRUEsY0FBdUNBLEVBQUVBLE9BQXFDQTtJQVdwR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFSkEsWUFBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsRUFBRUEsV0FBV0EsRUFBRUEsaUJBQWlCQSxFQUFFQSxpQkFBaUJBLEVBQUVBLFFBQVFBLEVBQUVBLGVBQWVBLEVBQUVBLFVBQUNBLFVBQVVBLEVBQUVBLEdBQTJCQSxFQUFFQSxlQUFlQSxFQUFFQSxl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RUFBRUEsY0FBTUEsWUFBS0EsRUFBTEEsQ0FBS0E7U0FDdEJBLENBQUNBLENBQUNBO1FBRUhBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBO1lBQ05BLEVBQUVBLEVBQUVBLE1BQU1BO1lBQ1ZBLEtBQUtBLEVBQUVBLGNBQU9BLGFBQU1BLEVBQU5BLENBQU1BO1lBQ3BCQSxPQUFPQSxFQUFFQSxjQUFNQSxnREFBeUNBLEVBQXpDQSxDQUF5Q0E7WUFDeERBLE9BQU9BLEVBQUVBLGNBQU1BLE9BQUFBLGVBQWVBLENBQUNBLFVBQVVBLENBQUNBLG9CQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEVBQUVBLEVBQXpFQSxDQUF5RUE7WUFDeEZBLElBQUlBLEVBQUVBO2dCQUNKQSxJQUFJQSxNQUFNQSxHQUFHQSxlQUFlQSxDQUFDQSxXQUFXQSxDQUFDQSxvQkFBZUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzFEQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFlYkEsQ0FBQ0E7Z0JBQ0RBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO1lBQ2hCQSxDQUFDQTtZQUNEQSxRQUFRQSxFQUFFQSxjQUFNQSxZQUFLQSxFQUFMQSxDQUFLQTtTQUN0QkEsQ0FBQ0EsQ0FBQ0E7UUFhSEEsUUFBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7SUFDdEJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBRUpBLGtCQUFrQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsZUFBVUEsQ0FBQ0EsQ0FBQ0E7QUFDM0NBLENBQUNBLEVBMUpNLElBQUksS0FBSixJQUFJLFFBMEpWIiwiZmlsZSI6ImNvbXBpbGVkLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxubW9kdWxlIE1haW4ge1xuXG4gIGV4cG9ydCB2YXIgcGx1Z2luTmFtZSA9IFwiZmFicmljOC1jb25zb2xlXCI7XG5cbiAgZXhwb3J0IHZhciBsb2c6IExvZ2dpbmcuTG9nZ2VyID0gTG9nZ2VyLmdldChwbHVnaW5OYW1lKTtcblxuICBleHBvcnQgdmFyIHRlbXBsYXRlUGF0aCA9IFwicGx1Z2lucy9tYWluL2h0bWxcIjtcblxuICAvLyBrdWJlcm5ldGVzIHNlcnZpY2UgbmFtZXNcbiAgZXhwb3J0IHZhciBjaGF0U2VydmljZU5hbWUgPSBcImxldHNjaGF0XCI7XG4gIGV4cG9ydCB2YXIgZ3JhZmFuYVNlcnZpY2VOYW1lID0gXCJncmFmYW5hXCI7XG4gIGV4cG9ydCB2YXIgYXBwTGlicmFyeVNlcnZpY2VOYW1lID0gXCJhcHAtbGlicmFyeVwiO1xuXG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm1haW5HbG9iYWxzLnRzXCIvPlxuXG4vLyBUT0RPIG5vdCBzdXJlIGlmIHRoZXNlIGFyZSByZXF1aXJlZD8gVGhleSBhcmUgZGVmaW5lZCBpbiBoYXd0aW8ta3ViZXJuZXRlcyB0b28uLi5cbi8qXG5kZWNsYXJlIHZhciBPU09BdXRoQ29uZmlnOiBLdWJlcm5ldGVzLk9wZW5TaGlmdE9BdXRoQ29uZmlnO1xuZGVjbGFyZSB2YXIgR29vZ2xlT0F1dGhDb25maWc6IEt1YmVybmV0ZXMuR29vZ2xlT0F1dGhDb25maWc7XG5kZWNsYXJlIHZhciBLZXljbG9ha0NvbmZpZzogS3ViZXJuZXRlcy5LZXlDbG9ha0F1dGhDb25maWc7XG4qL1xuXG5tb2R1bGUgTWFpbiB7XG5cbiAgZXhwb3J0IHZhciBfbW9kdWxlID0gYW5ndWxhci5tb2R1bGUocGx1Z2luTmFtZSwgW10pO1xuXG4gIHZhciB0YWIgPSB1bmRlZmluZWQ7XG5cbiAgX21vZHVsZS5jb25maWcoW1wiJGxvY2F0aW9uUHJvdmlkZXJcIiwgXCIkcm91dGVQcm92aWRlclwiLCBcIkhhd3Rpb05hdkJ1aWxkZXJQcm92aWRlclwiLFxuICAgICgkbG9jYXRpb25Qcm92aWRlciwgJHJvdXRlUHJvdmlkZXI6IG5nLnJvdXRlLklSb3V0ZVByb3ZpZGVyLCBidWlsZGVyOiBIYXd0aW9NYWluTmF2LkJ1aWxkZXJGYWN0b3J5KSA9PiB7XG4vKlxuICAgIHRhYiA9IGJ1aWxkZXIuY3JlYXRlKClcbiAgICAgIC5pZChwbHVnaW5OYW1lKVxuICAgICAgLnRpdGxlKCgpID0+IFwiRXhhbXBsZVwiKVxuICAgICAgLmhyZWYoKCkgPT4gXCIvZXhhbXBsZVwiKVxuICAgICAgLnN1YlBhdGgoXCJQYWdlIDFcIiwgXCJwYWdlMVwiLCBidWlsZGVyLmpvaW4odGVtcGxhdGVQYXRoLCBcInBhZ2UxLmh0bWxcIikpXG4gICAgICAuYnVpbGQoKTtcbiAgICBidWlsZGVyLmNvbmZpZ3VyZVJvdXRpbmcoJHJvdXRlUHJvdmlkZXIsIHRhYik7XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuKi9cbiAgfV0pO1xuXG4gIF9tb2R1bGUucnVuKFtcIiRyb290U2NvcGVcIiwgXCJIYXd0aW9OYXZcIiwgXCJLdWJlcm5ldGVzTW9kZWxcIiwgXCJTZXJ2aWNlUmVnaXN0cnlcIiwgXCJMb2dnZXJcIiwgXCJDb25maWd1cmF0aW9uXCIsICgkcm9vdFNjb3BlLCBuYXY6IEhhd3Rpb01haW5OYXYuUmVnaXN0cnksIEt1YmVybmV0ZXNNb2RlbCwgU2VydmljZVJlZ2lzdHJ5LCBMb2dnZXIsIENvbmZpZ3VyYXRpb24pID0+IHtcbiAgICBcbiAgICBpZiAoQ29uZmlndXJhdGlvbi5wbGF0Zm9ybSA9PT0gJ2ZhYnJpYzgnKSB7XG4gICAgICAgdmFyIGFwaUVuZHBvaW50Q29uZmlnID0gQ29uZmlndXJhdGlvbi5hcGkuZW5kcG9pbnQudG9Mb3dlckNhc2UoKTtcbiAgICAgICB2YXIgZHluYW1pY0VuZHBvaW50O1xuXG4gICAgICAgLy8gR2V0cyBjYWxsZWQgYmFjayBzbyB3ZSBjYW4gdXBkYXRlIHRoZSBlbmRwb2ludCBzZXR0aW5ncyB3aGVuIHRoZSBuYW1lc3BhY2UgY2hhbmdlc1xuICAgICAgICRyb290U2NvcGUuJG9uKCdrdWJlcm5ldGVzTW9kZWxVcGRhdGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgLy9pZiB0aGUgZW5kcG9pbnQgY29uZmlnIHN0YXJ0cyB3aXRoICdkeW5hbWljJyB0aGVuIHRyeSB0byBsb29rdXAgdGhlIGFwaW1hblxuICAgICAgICAgLy9iYWNrZW5kIGluIHRoZSBjdXJyZW50IG5hbWVzcGFjZS4gQnkgZGVmYXVsdCB5b3UnZCB3YW50IHRvIHVzZSB0aGUgZHluYW1pY1JvdXRlIHNpbmNlXG4gICAgICAgICAvL3RoYXQgaXMgdGhlIG9ubHkgcHVibGljbHkgYXZhaWxhYmxlIGVuZHBvaW50LCBidXQgdGhlcmUgbWF5YmUgdXNlY2FzZXMgd2hlcmUgeW91J2Qgd2FudFxuICAgICAgICAgLy90byB1c2UgdGhlIFNlcnZpY2VVcmwgKEt1YmVybmV0ZXMgU2VydmljZSBJUCBhZGRyZXNzKSwgb3IgdGhlIEt1YmVybmV0ZXMgUHJveHkuXG4gICAgICAgICAvL2R5bmFtaWNSb3V0ZSwgZHluYW1pY1NlcnZpY2VVcmwsIGR5bmFtaWNQcm94eVVybFxuICAgICAgICAgaWYgKGFwaUVuZHBvaW50Q29uZmlnLmluZGV4T2YoXCJkeW5hbWljXCIpID09PSAwKSB7XG4gICAgICAgICAgICB2YXIgbmFtZXNwYWNlID0gS3ViZXJuZXRlc01vZGVsLmN1cnJlbnROYW1lc3BhY2UoKTtcbiAgICAgICAgICAgIHZhciBoYXNTZXJ2aWNlID0gU2VydmljZVJlZ2lzdHJ5Lmhhc1NlcnZpY2UoXCJhcGltYW5cIik7XG4gICAgICAgICAgICBpZiAoaGFzU2VydmljZSA9PT0gdHJ1ZSAmJiBuYW1lc3BhY2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gS3ViZXJuZXRlc01vZGVsLmdldFNlcnZpY2UobmFtZXNwYWNlLCBcImFwaW1hblwiKTtcbiAgICAgICAgICAgICAgIExvZ2dlci5kZWJ1ZyhcImFwaW1hbiByb3V0ZTogXCIgKyBzZXJ2aWNlLiRjb25uZWN0VXJsKTtcbiAgICAgICAgICAgICAgIExvZ2dlci5kZWJ1ZyhcImFwaW1hbiBwcm94eVVybDogXCIgKyBzZXJ2aWNlLnByb3h5VXJsKTtcbiAgICAgICAgICAgICAgIExvZ2dlci5kZWJ1ZyhcImFwaW1hbiBzZXJ2aWNlVXJsOiBcIiArIHNlcnZpY2UuJHNlcnZpY2VVcmwpO1xuICAgICAgICAgICAgICAgaWYgKGFwaUVuZHBvaW50Q29uZmlnID09PSBcImR5bmFtaWNTZXJ2aWNlVXJsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pY0VuZHBvaW50ID0gc2VydmljZS4kc2VydmljZVVybCArIFwiYXBpbWFuXCI7XG4gICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFwaUVuZHBvaW50Q29uZmlnID09PSBcImR5bmFtaWNQcm94eVVybFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWNFbmRwb2ludCA9IHNlcnZpY2UucHJveHlVcmwgKyBcImFwaW1hblwiO1xuICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pY0VuZHBvaW50ID0gc2VydmljZS4kY29ubmVjdFVybCArIFwiYXBpbWFuXCI7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5hcGkuZW5kcG9pbnQgIT09IGR5bmFtaWNFbmRwb2ludCkge1xuICAgICAgICAgICAgICAgICAgICBDb25maWd1cmF0aW9uLmFwaS5lbmRwb2ludCA9IGR5bmFtaWNFbmRwb2ludDtcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmRlYnVnKFwiYXBpbWFuIHJvdXRlOiB7MH1cIiwgc2VydmljZS4kY29ubmVjdFVybCk7XG4gICAgICAgICAgICAgICAgICAgIExvZ2dlci5kZWJ1ZyhcImFwaW1hbiBwcm94eVVybDogezB9IFwiLCBzZXJ2aWNlLnByb3h5VXJsKTtcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmRlYnVnKFwiYXBpbWFuIHNlcnZpY2VVcmw6IHswfVwiLCBzZXJ2aWNlLiRzZXJ2aWNlVXJsKTtcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmluZm8oXCJBcGltYW4gRHluYW1pYyBFbmRwb2ludDogezB9XCIsIGR5bmFtaWNFbmRwb2ludCk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgQ29uZmlndXJhdGlvbi5hcGkuZW5kcG9pbnQgPSBcIm5vLWFwaW1hbi1ydW5uaW5nLWluLVwiICsgbmFtZXNwYWNlICsgXCItbmFtZXNwYWNlXCI7XG4gICAgICAgICAgICAgICAvLyBMb2dnZXIuZGVidWcoXCJObyBhcGltYW4gcnVubmluZyBpbiB7MH0gbmFtZXNwYWNlXCIsIG5hbWVzcGFjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmF2Lm9uKEhhd3Rpb01haW5OYXYuQWN0aW9ucy5DSEFOR0VELCBwbHVnaW5OYW1lLCAoaXRlbXMpID0+IHtcbiAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgc3dpdGNoKGl0ZW0uaWQpIHtcbiAgICAgICAgICBjYXNlICdmb3JnZSc6XG4gICAgICAgICAgY2FzZSAnanZtJzpcbiAgICAgICAgICBjYXNlICd3aWtpJzpcbiAgICAgICAgICBjYXNlICdkb2NrZXItcmVnaXN0cnknOlxuICAgICAgICAgICAgaXRlbS5pc1ZhbGlkID0gKCkgPT4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIG5hdi5hZGQoe1xuICAgICAgaWQ6ICdsaWJyYXJ5JyxcbiAgICAgIHRpdGxlOiAoKSA9PiAnTGlicmFyeScsXG4gICAgICB0b29sdGlwOiAoKSA9PiAnVmlldyB0aGUgbGlicmFyeSBvZiBhcHBsaWNhdGlvbnMnLFxuICAgICAgaXNWYWxpZDogKCkgPT4gU2VydmljZVJlZ2lzdHJ5Lmhhc1NlcnZpY2UoYXBwTGlicmFyeVNlcnZpY2VOYW1lKSAmJiBTZXJ2aWNlUmVnaXN0cnkuaGFzU2VydmljZShcImFwcC1saWJyYXJ5LWpvbG9raWFcIikgJiYgIUNvcmUuaXNSZW1vdGVDb25uZWN0aW9uKCksXG4gICAgICBocmVmOiAoKSA9PiBcIi93aWtpL3ZpZXdcIixcbiAgICAgIGlzQWN0aXZlOiAoKSA9PiBmYWxzZVxuICAgIH0pO1xuXG4gICAgdmFyIGtpYmFuYVNlcnZpY2VOYW1lID0gS3ViZXJuZXRlcy5raWJhbmFTZXJ2aWNlTmFtZTtcblxuICAgIG5hdi5hZGQoe1xuICAgICAgaWQ6ICdraWJhbmEnLFxuICAgICAgdGl0bGU6ICgpID0+ICAnTG9ncycsXG4gICAgICB0b29sdGlwOiAoKSA9PiAnVmlldyBhbmQgc2VhcmNoIGFsbCBsb2dzIGFjcm9zcyBhbGwgY29udGFpbmVycyB1c2luZyBLaWJhbmEgYW5kIEVsYXN0aWNTZWFyY2gnLFxuICAgICAgaXNWYWxpZDogKCkgPT4gU2VydmljZVJlZ2lzdHJ5Lmhhc1NlcnZpY2Uoa2liYW5hU2VydmljZU5hbWUpICYmICFDb3JlLmlzUmVtb3RlQ29ubmVjdGlvbigpLFxuICAgICAgaHJlZjogKCkgPT4gS3ViZXJuZXRlcy5raWJhbmFMb2dzTGluayhTZXJ2aWNlUmVnaXN0cnkpLFxuICAgICAgaXNBY3RpdmU6ICgpID0+IGZhbHNlXG4gICAgfSk7XG5cbiAgICBuYXYuYWRkKHtcbiAgICAgIGlkOiAnYXBpbWFuJyxcbiAgICAgIHRpdGxlOiAoKSA9PiAnQVBJIE1hbmFnZW1lbnQnLFxuICAgICAgdG9vbHRpcDogKCkgPT4gJ0FkZCBQb2xpY2llcyBhbmQgUGxhbnMgdG8geW91ciBBUElzIHdpdGggQXBpbWFuJyxcbiAgICAgIGlzVmFsaWQ6ICgpID0+IFNlcnZpY2VSZWdpc3RyeS5oYXNTZXJ2aWNlKCdhcGltYW4nKSAmJiAhQ29yZS5pc1JlbW90ZUNvbm5lY3Rpb24oKSxcbiAgICAgIGhyZWY6ICgpID0+IFwiL2FwaS1tYW5hZ2VyXCJcbiAgICB9KTtcblxuICAgIG5hdi5hZGQoe1xuICAgICAgaWQ6ICdncmFmYW5hJyxcbiAgICAgIHRpdGxlOiAoKSA9PiAgJ01ldHJpY3MnLFxuICAgICAgdG9vbHRpcDogKCkgPT4gJ1ZpZXdzIG1ldHJpY3MgYWNyb3NzIGFsbCBjb250YWluZXJzIHVzaW5nIEdyYWZhbmEgYW5kIEluZmx1eERCJyxcbiAgICAgIGlzVmFsaWQ6ICgpID0+IFNlcnZpY2VSZWdpc3RyeS5oYXNTZXJ2aWNlKGdyYWZhbmFTZXJ2aWNlTmFtZSkgJiYgIUNvcmUuaXNSZW1vdGVDb25uZWN0aW9uKCksXG4gICAgICBocmVmOiAoKSA9PiBTZXJ2aWNlUmVnaXN0cnkuc2VydmljZUxpbmsoZ3JhZmFuYVNlcnZpY2VOYW1lKSxcbiAgICAgIGlzQWN0aXZlOiAoKSA9PiBmYWxzZVxuICAgIH0pO1xuXG4gICAgbmF2LmFkZCh7XG4gICAgICBpZDogXCJjaGF0XCIsXG4gICAgICB0aXRsZTogKCkgPT4gICdDaGF0JyxcbiAgICAgIHRvb2x0aXA6ICgpID0+ICdDaGF0IHJvb20gZm9yIGRpc2N1c3NpbmcgdGhpcyBuYW1lc3BhY2UnLFxuICAgICAgaXNWYWxpZDogKCkgPT4gU2VydmljZVJlZ2lzdHJ5Lmhhc1NlcnZpY2UoY2hhdFNlcnZpY2VOYW1lKSAmJiAhQ29yZS5pc1JlbW90ZUNvbm5lY3Rpb24oKSxcbiAgICAgIGhyZWY6ICgpID0+IHtcbiAgICAgICAgdmFyIGFuc3dlciA9IFNlcnZpY2VSZWdpc3RyeS5zZXJ2aWNlTGluayhjaGF0U2VydmljZU5hbWUpO1xuICAgICAgICBpZiAoYW5zd2VyKSB7XG4vKlxuICAgICAgICAgIFRPRE8gYWRkIGEgY3VzdG9tIGxpbmsgdG8gdGhlIGNvcnJlY3Qgcm9vbSBmb3IgdGhlIGN1cnJlbnQgbmFtZXNwYWNlP1xuXG4gICAgICAgICAgdmFyIGlyY0hvc3QgPSBcIlwiO1xuICAgICAgICAgIHZhciBpcmNTZXJ2aWNlID0gU2VydmljZVJlZ2lzdHJ5LmZpbmRTZXJ2aWNlKFwiaHVib3RcIik7XG4gICAgICAgICAgaWYgKGlyY1NlcnZpY2UpIHtcbiAgICAgICAgICAgIGlyY0hvc3QgPSBpcmNTZXJ2aWNlLnBvcnRhbElQO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXJjSG9zdCkge1xuICAgICAgICAgICAgdmFyIG5pY2sgPSBsb2NhbFN0b3JhZ2VbXCJnb2dzVXNlclwiXSB8fCBsb2NhbFN0b3JhZ2VbXCJpcmNOaWNrXCJdIHx8IFwibXluYW1lXCI7XG4gICAgICAgICAgICB2YXIgcm9vbSA9IFwiI2ZhYnJpYzgtXCIgKyAgY3VycmVudEt1YmVybmV0ZXNOYW1lc3BhY2UoKTtcbiAgICAgICAgICAgIGFuc3dlciA9IFVybEhlbHBlcnMuam9pbihhbnN3ZXIsIFwiL2tpd2lcIiwgaXJjSG9zdCwgXCI/Jm5pY2s9XCIgKyBuaWNrICsgcm9vbSk7XG4gICAgICAgICAgfVxuKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5zd2VyO1xuICAgICAgfSxcbiAgICAgIGlzQWN0aXZlOiAoKSA9PiBmYWxzZVxuICAgIH0pO1xuXG4gICAgLy8gVE9ETyB3ZSBzaG91bGQgbW92ZSB0aGlzIHRvIGEgbmljZXIgbGluayBpbnNpZGUgdGhlIExpYnJhcnkgc29vbiAtIGFsc28gbGV0cyBoaWRlIHVudGlsIGl0IHdvcmtzLi4uXG4vKlxuICAgIHdvcmtzcGFjZS50b3BMZXZlbFRhYnMucHVzaCh7XG4gICAgICBpZDogJ2NyZWF0ZVByb2plY3QnLFxuICAgICAgdGl0bGU6ICgpID0+ICAnQ3JlYXRlJyxcbiAgICAgIHRvb2x0aXA6ICgpID0+ICdDcmVhdGVzIGEgbmV3IHByb2plY3QnLFxuICAgICAgaXNWYWxpZDogKCkgPT4gU2VydmljZVJlZ2lzdHJ5Lmhhc1NlcnZpY2UoXCJhcHAtbGlicmFyeVwiKSAmJiBmYWxzZSxcbiAgICAgIGhyZWY6ICgpID0+IFwiL3Byb2plY3QvY3JlYXRlXCJcbiAgICB9KTtcbiovXG5cbiAgICBsb2cuZGVidWcoXCJsb2FkZWRcIik7XG4gIH1dKTtcblxuICBoYXd0aW9QbHVnaW5Mb2FkZXIuYWRkTW9kdWxlKHBsdWdpbk5hbWUpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
/// <reference path="../defs.d.ts"/>

/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
/// <reference path="../../includes.ts"/>
var DevExample;
(function (DevExample) {
    DevExample.pluginName = "hawtio-test-plugin";
    DevExample.log = Logger.get(DevExample.pluginName);
    DevExample.templatePath = "test-plugins/example/html";
})(DevExample || (DevExample = {}));

/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
/// <reference path="../../includes.ts"/>
/// <reference path="exampleGlobals.ts"/>
var DevExample;
(function (DevExample) {
    DevExample._module = angular.module(DevExample.pluginName, []);
    var tab = undefined;
    DevExample._module.config(["$locationProvider", "$routeProvider", "HawtioNavBuilderProvider", function ($locationProvider, $routeProvider, builder) {
        tab = builder.create().id(DevExample.pluginName).title(function () { return "Test DevExample"; }).href(function () { return "/test_example"; }).subPath("Page 1", "page1", builder.join(DevExample.templatePath, "page1.html")).build();
        builder.configureRouting($routeProvider, tab);
    }]);
    DevExample._module.run(["HawtioNav", function (HawtioNav) {
        HawtioNav.add(tab);
        DevExample.log.debug("loaded");
    }]);
})(DevExample || (DevExample = {}));

/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
/// <reference path="examplePlugin.ts"/>
var DevExample;
(function (DevExample) {
    DevExample.Page1Controller = DevExample._module.controller("DevExample.Page1Controller", ["$scope", function ($scope) {
        $scope.target = "World!";
    }]);
})(DevExample || (DevExample = {}));

angular.module("fabric8-console-test-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("test-plugins/example/html/page1.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"DevExample.Page1Controller\">\n    <h1>Page 1</h1>\n    <p>This plugin won\'t be exported in the bower package</p>\n    <p class=\'customClass\'>Hello {{target}}</p>\n  </div>\n</div>\n");}]); hawtioPluginLoader.addModule("fabric8-console-test-templates");