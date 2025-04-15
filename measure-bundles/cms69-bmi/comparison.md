Comparison MeasureReports for CMS69 qi-core 4.1.1 v 0.2.0.0

|   |initial-population|denominator|denominator-exclusion|denominator-exception|numerator|measureScore|
|---|:----------------:|:---------:|:-------------------:|:-------------------:|:-------:|:----------:|
|Test Case|            |           |                     |                     |         |            |
|MADiE/fqm|            |           |                     |                     |         |            |
|HAPI*    |            |           |                     |                     |         |            |
|[Flowchart](https://ecqi.healthit.gov/sites/default/files/ecqm/measures/CMS69v13-eCQM-Flow.pdf)|1||1|0|0|null|

Test Case Patient/1b102c21-830a-41a5-ac27-9aa77ea5adfe is a female who is 24 years old at the start of the Measurement Period. She has an Encounter that started at exacly midnight 2024-01-01 and lasted 30 minutes. The diagnosis code is SnomedCT 10197000 which is a member of the "Encounter to Evaluate BMI" Value
Set so this is a Qualifying Encounter. So she's a member of the **Initial Population**. 

She is not pregnant. She has a ServiceRequest code and a Procedure code that are part of "Hospice Care Ambulatory". Either of those qualify her for the Hospice **Denominator Exclusion**. 

There is nothing in her record that indicates any *medical reason for not documenting a BMI on the same day as the eligible encounter*, *medical reason for not documenting appropriate follow-up plan on the same day as the eligible encounter*, or *patient reason for not measuring height and/or weight*. So she does not qualify for **Denominator Exception**

She does not have a BMI recorded so she is not in the **Numerator**. 


Here is the meausureScore calculation from the flowchart. 

```
Performance Rate = **Numerator**/(**Denominator** - **Denominator Exclusions** - **Denoninator Exceptions**)
```
This definition is designed for a population report, so it needs to be re-interpreted for an individual patient. Otherwise if you took it verbatim then this patients score would be 
```
0 /( ? - 1 - 1)
```
I put a ? mark in there because -- wait for it -- where is it defined? Or better put, What did the authors intend? Well, look back through the flowsheet. On page 1, on the left hand side is a the column **Initial Population**. At the bottom is **Denominator** in a box demarcated with a `b`. In the measureScore equation on page three, that b appears on the bottom of the division, to the left as in *b = 100 patients*. So the first term in the divisor is the **Initial Population**. Now we restate for clarity

```
Performance Rate = **Numerator**/(**Initial Population** - **Denominator Exclusions** - **Denominator Exceptions**)
```

And really the Performance Rate is the measureScore so we will say

```
measureScore = **Numerator**/(**Initial Population** - **Denominator Exclusions** - **Denominator Exceptions**)
```

Now for the $20 question. What is the Denominator elevment in the MeasureReport supposed to represent?:
```
{
  "id": "13A65BC7-CCB8-4189-869C-6C8E46AD5524",
  "code": {
    "coding": [ {
      "system": "http://terminology.hl7.org/CodeSystem/measure-population",
      "code": "denominator",
      "display": "Denominator"
    } ]
  },
  "count": 1
}
```

Should be obvious, right? 

If you refer to the [Measure Population ValueSet]()https://www.hl7.org/fhir/R4/valueset-measure-population.html you will find

|Code|Display|Definition|
|----|-------|----------|
|denominator|Denominator|The lower portion of a fraction used to calculate a rate, proportion, or ratio. The denominator can be the same as the initial population, or a subset of the initial population to further constrain the population for the purpose of the measure.|

You see the confusion? fqm is using Denominator = Initial Population as the Denominator Count, wheras it should be 

```
Performance Rate = **Numerator**/THIS PART--->(**Initial Population** - **Denominator Exclusions** - **Denominator Exceptions**)<---
```

It not hard to see where this confusion might have arisen from because even the source CQL for the measure has
```
...
define "Denominator":
  "Initial Population"
...
```


* {HAPI FHIR 8.0.0}/Measure/PCSBMIScreenAndFollowUpFHIR/$evaluate-measure?periodStart=2024-01-01&periodEnd=2024-12-31?subject=Patient/1b102c21-830a-41a5-ac27-9aa77ea5adfe