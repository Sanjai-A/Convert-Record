global class FieldExplorerController
{ 
    @Auraenabled(cacheable=true)
    public static List<string> getObjects()
    {
        List<string> sObjectList = new List<string>();
        
        for(Schema.SObjectType objTyp : Schema.getGlobalDescribe().Values()){
            String name = objTyp.getDescribe().getName();
            if((!name.containsignorecase('history') && !name.containsignorecase('tag')&&
                !name.containsignorecase('share') && !name.containsignorecase('feed')) || 
               name.toLowerCase().right(3) ==  '__c'){      
                   sObjectList.add(name);
               }
        }
        system.debug('size:'+sObjectList.size());
        return sObjectList;
    }
   
    @Auraenabled(cacheable=true)
    public static List<FieldWrap> getFields(string objectName)
    {
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe(); 
        Schema.SObjectType ctype = gd.get(objectName); 
        Map<String, Schema.SobjectField> fmap = ctype.getDescribe().fields.getMap();   
        List<FieldWrap> strList = new List<FieldWrap>();
        for(String fieldName: fmap.keySet()) {
            FieldWrap wmp = new FieldWrap();
            wmp.name = fieldName;
            wmp.label = fmap.get(fieldName).getDescribe().getLabel();        
            strList.add(wmp);
        }
        return strList;
    }
    
    public class FieldWrap
    {
        @Auraenabled
        public string Name{get;set;}
        @Auraenabled
        public string Label{get;set;}
    }
}