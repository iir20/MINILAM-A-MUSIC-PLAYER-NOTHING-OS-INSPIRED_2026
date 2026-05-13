package com.minilam.os

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.Alignment
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
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
            GlanceTheme {
                Column(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .background(Color.Black)
                        .padding(10.dp)
                ) {
                    // Header Status
                    Row(
                        modifier = GlanceModifier.fillMaxWidth().padding(bottom = 8.dp),
                        verticalAlignment = Alignment.Vertical.CenterVertically
                    ) {
                        Text(
                            text = "SPECTRUM_ANALYSIS",
                            style = TextStyle(color = ColorProvider(Color.White), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        )
                        Spacer(modifier = GlanceModifier.defaultWeight())
                        Box(modifier = GlanceModifier.size(4.dp).background(Color(0xFFFF3B30))) {}
                    }
                    
                    // Spectrum Area
                    Box(
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .height(80.dp)
                            .background(Color.White.copy(alpha = 0.05f))
                            .padding(8.dp)
                    ) {
                        Row(
                            modifier = GlanceModifier.fillMaxSize(),
                            horizontalAlignment = Alignment.Horizontal.CenterHorizontally,
                            verticalAlignment = Alignment.Vertical.Bottom
                        ) {
                            val bars = listOf(25, 45, 65, 35, 55, 25, 40, 15, 35, 50, 70, 10, 30, 45, 20)
                            bars.forEachIndexed { i, h ->
                                Box(
                                    modifier = GlanceModifier
                                        .defaultWeight()
                                        .height(h.dp)
                                        .padding(horizontal = 1.dp)
                                        .background(if (i % 5 == 0) Color(0xFFFF3B30) else Color.White.copy(alpha = 0.3f))
                                ) {}
                            }
                        }
                    }
                    
                    Spacer(modifier = GlanceModifier.height(8.dp))
                    
                    Row(modifier = GlanceModifier.fillMaxWidth()) {
                        Text(text = "LOW_END", style = TextStyle(color = ColorProvider(Color.White.copy(alpha = 0.3f)), fontSize = 6.sp))
                        Spacer(modifier = GlanceModifier.defaultWeight())
                        Text(text = "HIGH_END", style = TextStyle(color = ColorProvider(Color.White.copy(alpha = 0.3f)), fontSize = 6.sp))
                    }
                }
            }
        }
    }
}
