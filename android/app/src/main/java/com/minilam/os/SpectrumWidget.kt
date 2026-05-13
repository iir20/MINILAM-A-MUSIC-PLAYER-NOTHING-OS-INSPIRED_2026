package com.minilam.os

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.Alignment
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import androidx.glance.background

class SpectrumWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(Color.Black)
                    .padding(12.dp)
            ) {
                Text(
                    text = "SPECTRUM_ANALYZER",
                    style = TextStyle(color = ColorProvider(Color.White), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                )
                
                Spacer(modifier = GlanceModifier.height(12.dp))
                
                // Spectrum Bars
                Row(
                    modifier = GlanceModifier.fillMaxWidth().height(80.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalAlignment = Alignment.Bottom
                ) {
                    val bars = listOf(30, 50, 70, 40, 60, 30, 45, 20, 40, 55, 75, 15)
                    bars.forEachIndexed { i, h ->
                        Box(
                            modifier = GlanceModifier
                                .defaultWeight()
                                .height(h.dp)
                                .padding(horizontal = 1.dp)
                                .background(if (i % 3 == 0) Color(0xFFFF3B30) else Color.White.copy(alpha = 0.4f))
                        ) {}
                    }
                }
                
                Spacer(modifier = GlanceModifier.height(8.dp))
                
                Row(modifier = GlanceModifier.fillMaxWidth()) {
                    Text(text = "20Hz", style = TextStyle(color = ColorProvider(Color.White.copy(alpha = 0.3f)), fontSize = 6.sp))
                    Spacer(modifier = GlanceModifier.defaultWeight())
                    Text(text = "20kHz", style = TextStyle(color = ColorProvider(Color.White.copy(alpha = 0.3f)), fontSize = 6.sp))
                }
            }
        }
    }
}
